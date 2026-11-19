# BatteryGuard AI

Dashboard prescriptivo para la asignacion de rutas de una flota de vehiculos electricos. El proyecto combina un frontend responsive (Mobile-First y Desktop), una API REST en Node.js y un servicio de inferencia con el modelo XGBoost de BatteryGuard en Python/FastAPI.

## Estado actual

| Componente | Estado | Detalle |
|---|---|---|
| Frontend | Implementado | Dashboard mobile/desktop responsive con visualización en tiempo real |
| API Node | Implementado | Express 5, validación Zod, cliente FastAPI y proxy enriquecido |
| Servicio IA | Implementado | FastAPI carga XGBoost y preprocessor desde `ai-service/vendor/BatteryGuard/models` |
| Compilación frontend | Verificada | `npm run build` genera la salida de Vite en `dist/` sin errores |
| Pruebas del backend | Verificadas | `npm test`: 3 pruebas aprobadas (validación, mapeo, precaución e índices) |
| Integración frontend -> API | Implementado | Conexión activa a `POST /api/v1/recommendations/evaluate` con fallback local offline transparente |
| Predicción PRECAUCIÓN | Implementado | Inferencia tri-estado (`APROBADO`, `PRECAUCION`, `DENEGADO`) calibrada con probabilidades de XGBoost |
| Índices de estrés por IA | Implementado | 4 dimensiones calculadas (`Vulnerabilidad`, `Exigencia Mecánica`, `Estrés Térmico`, `Riesgo Combinado`) y regla prescriptiva asociada |

El frontend se conecta automáticamente al backend si está disponible (`http://localhost:3000`). Si los servicios no están encendidos, conmuta de forma transparente al motor prescriptivo local para garantizar disponibilidad continua.

## Arquitectura

```text
index.html                  Entrada web principal
src/                        Dashboard UI y cliente de recomendación
  ├── components/           Componentes modulares (Panel, Veredicto, Gráfico, etc.)
  ├── data/                 Escenarios operativos y catálogo de flota
  └── services/             Motor de inferencia con conexión a API y fallback local
backend/                    API REST Gateway (Node.js + Express 5 + Zod)
ai-service/                 Microservicio de inferencia (Python 3.11 + FastAPI + XGBoost)
ai-service/vendor/BatteryGuard/
                            Modelos entrenados: battery_xgboost_v1.joblib y preprocessor.joblib
docs/architecture.md        Contrato técnico, cálculo de índices y reglas prescriptivas
```

El flujo operativo es:

```text
Dashboard Web -> POST /api/v1/recommendations/evaluate (Node.js :3000)
              -> Validación Zod y mapeo canónico
              -> POST /predict (FastAPI :8000)
              -> Inferencia XGBoost + probabilidades
              -> Cálculo de índices de estrés (Vulnerabilidad, Mecánica, Térmico, Combinado)
              -> Determinación de dictamen (APROBADO, PRECAUCIÓN, DENEGADO)
              -> Respuesta con regla y justificación técnica al Frontend
```

## Tecnologías

- **Frontend:** HTML5, JavaScript moderno (ES Modules), Tailwind CSS y Vite.
- **Backend:** Node.js 20+, Express 5, Zod, CORS y Fetch API nativo.
- **Servicio de IA:** Python 3.11, FastAPI, Pydantic, pandas (v2.2.3 estable), scikit-learn y XGBoost.
- **Modelos:** `battery_xgboost_v1.joblib` y `preprocessor.joblib` (en `ai-service/vendor/BatteryGuard/models`).

---

## Ejecución en Windows (Paso a Paso)

### 1. Iniciar el Servicio de Inferencia (Python + FastAPI)

Desde la raíz del proyecto (`C:\Users\erick\OneDrive\Documentos\TIProyects\IA`):

```powershell
# Utilizando el entorno virtual de Python
$py = "C:\venvs\batteryguard\Scripts\python.exe"

# O si tienes un venv local:
# .\ai-service\.venv\Scripts\Activate.ps1

& $py -m uvicorn app.main:app --app-dir ai-service --reload --port 8000
```

> **Verificación:** Abre [http://localhost:8000/health](http://localhost:8000/health) y la documentación interactiva OpenAPI en [http://localhost:8000/docs](http://localhost:8000/docs).

### 2. Iniciar la API Gateway (Node.js + Express)

En una segunda terminal:

```powershell
Set-Location backend
npm install
npm run dev
```

La API escuchará en `http://localhost:3000`.

Endpoints principales:
- `GET /api/v1/health`
- `POST /api/v1/recommendations/evaluate`

Ejemplo de prueba en PowerShell:

```powershell
$body = @{
  unit = "EV-100000"
  battery = "Buena"
  route = "Montaña"
  weather = "Templado"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/v1/recommendations/evaluate" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

### 3. Iniciar el Frontend (Dashboard)

En una tercera terminal (desde la raíz):

```powershell
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador. Al presionar **Evaluar Asignación**, el dashboard consultará en vivo al backend y mostrará la insignia:
`🟢 IA Live (XGBoost API)` con la confianza de la predicción y las barras de estrés actualizadas.

---

## Pruebas Automatizadas

```powershell
Set-Location backend
npm test
```

Las 3 pruebas verifican:
1. Mapeo de valores del dashboard a categorías del modelo.
2. Validación de payloads con Zod y flujo completo hacia el servicio de IA.
3. Soporte del veredicto **PRECAUCIÓN** y recepción de los 4 índices de estrés numéricos.

---

## Documentación Técnica

- [Arquitectura del Sistema y Contrato de Inferencia](docs/architecture.md)
- [Artefactos y Entrenamiento de BatteryGuard](ai-service/vendor/BatteryGuard/README.md)
