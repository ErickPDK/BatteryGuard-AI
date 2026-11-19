import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal, Optional, Dict, Any

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel, Field


class ModelInput(BaseModel):
    # Admite tanto los valores del dashboard como los canónicos del modelo
    unit: Optional[str] = Field(default="EV-100000", description="Identificador del vehículo")
    battery: Optional[str] = Field(default=None, description="Salud de batería: Buena, Media, Mala")
    route: Optional[str] = Field(default=None, description="Topografía: Plana, Urbana, Montaña")
    weather: Optional[str] = Field(default=None, description="Clima: Templado, Frío, Cálido, Extremo")

    # Campos canónicos directos para compatibilidad con el entrenamiento original
    SOH: Optional[Literal["Optima", "Degradada"]] = None
    Topografia: Optional[Literal["Plana", "Montanosa"]] = None
    Clima: Optional[Literal["Templado", "Calor Extremo"]] = None


def load_artifacts():
    model_dir_value = os.environ.get("BATTERYGUARD_MODEL_DIR")
    if not model_dir_value:
        candidate = Path(__file__).resolve().parent.parent / "vendor" / "BatteryGuard" / "models"
        if candidate.is_dir():
            model_dir = candidate
        else:
            return None, None, "Configura BATTERYGUARD_MODEL_DIR con la carpeta 'models' del repositorio BatteryGuard."
    else:
        model_dir = Path(model_dir_value)

    model_path = model_dir / "battery_xgboost_v1.joblib"
    preprocessor_path = model_dir / "preprocessor.joblib"
    missing = [str(path) for path in (model_path, preprocessor_path) if not path.is_file()]
    if missing:
        return None, None, f"No se encontraron los artefactos del modelo en '{model_dir}': {', '.join(missing)}"

    try:
        model = joblib.load(model_path)
        preprocessor = joblib.load(preprocessor_path)
        return model, preprocessor, None
    except Exception as exc:
        return None, None, f"Error al deserializar modelos .joblib: {exc}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    model, preprocessor, error = load_artifacts()
    app.state.model = model
    app.state.preprocessor = preprocessor
    app.state.model_error = error
    if error:
        print(f"[BatteryGuard AI Service] AVISO: {error}")
    else:
        print("[BatteryGuard AI Service] Modelos XGBoost y preprocessor cargados exitosamente.")
    yield


app = FastAPI(
    title="BatteryGuard AI Service",
    description="Servicio de inferencia prescriptiva de asignación de rutas y estimación de estrés térmico/mecánico",
    version="2.1.0",
    lifespan=lifespan
)


@app.get("/health")
def health(request: Request):
    return {
        "status": "ok",
        "service": "batteryguard-ai",
        "model_loaded": request.app.state.model is not None,
        "model_error": request.app.state.model_error
    }


def map_to_canonical(battery: Optional[str], route: Optional[str], weather: Optional[str],
                      soh_direct: Optional[str], topo_direct: Optional[str], clima_direct: Optional[str]):
    """Mapea valores del dashboard a las categorías canónicas con las que se entrenó XGBoost"""
    # SOH
    if soh_direct:
        soh = soh_direct
    elif battery in ["Media", "Mala", "Degradada"]:
        soh = "Degradada"
    else:
        soh = "Optima"

    # Topografía
    if topo_direct:
        topo = topo_direct
    elif route in ["Montaña", "Montanosa"]:
        topo = "Montanosa"
    else:
        topo = "Plana"

    # Clima
    if clima_direct:
        clima = clima_direct
    elif weather in ["Extremo", "Calor Extremo"]:
        clima = "Calor Extremo"
    else:
        clima = "Templado"

    return soh, topo, clima


def calculate_stress_indices_and_verdict(unit: str, battery: str, route: str, weather: str,
                                         prob_failure: float) -> Dict[str, Any]:
    """
    Calcula los 4 índices de estrés basados en el perfil físico del vehículo acoplado
    con la probabilidad de falla calculada por el modelo XGBoost.
    """
    # 1. Base por salud de batería (Vulnerabilidad)
    if battery == "Mala":
        vuln = int(75 + prob_failure * 20)
    elif battery == "Media":
        vuln = int(25 + prob_failure * 25)
    else:  # Buena
        vuln = int(12 + prob_failure * 15)

    # 2. Exigencia Mecánica (Topografía)
    if route == "Montaña":
        mech = int(50 + prob_failure * 15)
        if battery == "Media":
            mech = max(mech, 60)
        elif battery == "Mala":
            mech = max(mech, 85)
    elif route == "Urbana":
        mech = 12 if battery == "Buena" else 18
    else:  # Plana
        mech = 10 if battery == "Buena" else 25

    # 3. Estrés Térmico (Clima + regeneración)
    if weather == "Extremo":
        therm = int(80 + prob_failure * 15)
    elif weather == "Cálido":
        therm = 35 if route == "Montaña" else 25
    elif weather == "Frío":
        therm = 18 if route == "Urbana" else 22
    else:  # Templado
        therm = 20 if route == "Montaña" else (8 if battery == "Buena" else 25)

    # Normalizaciones a rangos [5, 98]
    vuln = max(5, min(98, vuln))
    mech = max(5, min(98, mech))
    therm = max(5, min(98, therm))

    # 4. Riesgo Combinado (Ponderación 40% vuln + 30% mec + 30% térmico ajustado por XGBoost)
    combined = int(round(vuln * 0.40 + mech * 0.30 + therm * 0.30))
    # Ajuste de consistencia con XGBoost
    if prob_failure >= 0.65:
        combined = max(combined, int(round(prob_failure * 100)))

    combined = max(5, min(98, combined))

    # 5. Determinación del Dictamen Tri-Estado (APROBADO, PRECAUCION, DENEGADO)
    if combined <= 25 and vuln < 30 and therm < 50:
        verdict = "APROBADO"
        rule_id = f"R-001: Batería saludable + Ruta {route.lower()} + Clima {weather.lower()}"
        justification = (
            f"La unidad {unit} cumple los criterios técnicos de seguridad para la ruta asignada. "
            f"Riesgo combinado bajo ({combined}%) con degradación química mínima."
        )
    elif combined > 60 or vuln >= 75 or therm >= 75:
        verdict = "DENEGADO"
        rule_id = "R-003: Bloqueo preventivo por estrés térmico/degradación crítica"
        justification = (
            f"Bloqueo preventivo para {unit}. El perfil de estrés combinado ({combined}%) o la vulnerabilidad "
            f"de celdas superan el umbral seguro. Riesgo de caída de tensión en vía."
        )
    else:
        # Zona intermedia de riesgo -> PRECAUCIÓN
        verdict = "PRECAUCION"
        rule_id = f"R-002: Despacho condicional ({route} + Batería {battery})"
        justification = (
            f"Se autoriza asignación condicional para {unit}. El vehículo puede operar pero la exigencia mecánica "
            f"o térmica ({combined}% de riesgo) aconseja limitar velocidad y monitorear telemetría."
        )

    return {
        "verdict": verdict,
        "ruleId": rule_id,
        "justification": justification,
        "indices": {
            "vulnerability": vuln,
            "mechanicalDemand": mech,
            "thermalStress": therm,
            "combinedRisk": combined
        }
    }


@app.post("/predict")
def predict(payload: ModelInput, request: Request):
    model = request.app.state.model
    preprocessor = request.app.state.preprocessor

    if model is None or preprocessor is None:
        raise HTTPException(
            status_code=503,
            detail=f"El modelo de IA no está disponible: {request.app.state.model_error or 'No configurado'}"
        )

    # Resolver valores
    unit = payload.unit or "EV-100000"
    battery = payload.battery or ("Buena" if payload.SOH == "Optima" else "Mala")
    route = payload.route or ("Montaña" if payload.Topografia == "Montanosa" else "Plana")
    weather = payload.weather or ("Extremo" if payload.Clima == "Calor Extremo" else "Templado")

    # Mapeo canónico para las 3 features de XGBoost
    soh, topo, clima = map_to_canonical(
        battery, route, weather,
        payload.SOH, payload.Topografia, payload.Clima
    )

    # Inferencia con XGBoost
    model_df = pd.DataFrame([{"SOH": soh, "Topografia": topo, "Clima": clima}])
    processed = preprocessor.transform(model_df[["SOH", "Topografia", "Clima"]])
    class_prediction = int(model.predict(processed)[0])
    classes = [int(v) for v in model.classes_]

    probabilities_arr = model.predict_proba(processed)[0]
    class_idx = classes.index(class_prediction)
    confidence = float(probabilities_arr[class_idx])

    # Probabilidad de clase 1 (Falla) vs clase 0 (Sin Falla)
    idx_failure = classes.index(1) if 1 in classes else 1
    idx_safe = classes.index(0) if 0 in classes else 0
    prob_failure = float(probabilities_arr[idx_failure])
    prob_safe = float(probabilities_arr[idx_safe])

    # Calcular índices de estrés y veredicto prescriptivo tri-estado (con PRECAUCIÓN)
    prescriptive = calculate_stress_indices_and_verdict(
        unit=unit,
        battery=battery,
        route=route,
        weather=weather,
        prob_failure=prob_failure
    )

    return {
        "unit": unit,
        "inputMapped": {
            "battery": battery,
            "route": route,
            "weather": weather,
            "canonical": {"SOH": soh, "Topografia": topo, "Clima": clima}
        },
        "classPrediction": class_prediction,
        "binaryLabel": "APROBADO" if class_prediction == 0 else "DENEGADO",
        "verdict": prescriptive["verdict"],  # "APROBADO", "PRECAUCION", "DENEGADO"
        "confidence": round(confidence * 100, 2),
        "probabilities": {
            "safe": round(prob_safe * 100, 2),
            "failure": round(prob_failure * 100, 2)
        },
        "indices": prescriptive["indices"],
        "ruleId": prescriptive["ruleId"],
        "justification": prescriptive["justification"],
        "status": "success"
    }
