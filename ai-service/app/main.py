import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal, Optional

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel


class ModelInput(BaseModel):
    SOH: Literal["Optima", "Degradada"]
    Topografia: Literal["Plana", "Montanosa"]
    Clima: Literal["Templado", "Calor Extremo"]


def load_artifacts():
    model_dir_value = os.environ.get("BATTERYGUARD_MODEL_DIR")
    if not model_dir_value:
        # Intentar ruta relativa por defecto si existe vendor/BatteryGuard/models
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


app = FastAPI(title="BatteryGuard AI Service", version="1.0.0", lifespan=lifespan)


@app.get("/health")
def health(request: Request):
    return {
        "status": "ok",
        "service": "batteryguard-ai",
        "model_loaded": request.app.state.model is not None,
        "model_error": request.app.state.model_error
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

    model_input = pd.DataFrame([payload.model_dump()])
    processed = preprocessor.transform(model_input[["SOH", "Topografia", "Clima"]])
    class_prediction = int(model.predict(processed)[0])
    classes = [int(value) for value in model.classes_]
    confidence = float(model.predict_proba(processed)[0][classes.index(class_prediction)])

    labels = {0: "APROBADO", 1: "DENEGADO"}
    if class_prediction not in labels:
        raise HTTPException(status_code=500, detail="El modelo devolvió una clase no soportada.")

    return {
        "classPrediction": class_prediction,
        "label": labels[class_prediction],
        "confidence": round(confidence * 100, 2),
        "status": "success"
    }
