# BatteryGuard AI

Dashboard prescriptivo para la asignacion de rutas de una flota de vehiculos electricos. El proyecto combina un frontend responsive, una API REST y un servicio de inferencia con el modelo XGBoost de BatteryGuard.

## Estado actual

| Componente | Estado | Detalle |
|---|---|---|
| Frontend | Implementado | Dashboard mobile/desktop y motor local con 8 escenarios |
| API Node | Implementado | Express 5, validacion Zod, mapeo de variables y cliente FastAPI |
| Servicio IA | Implementado | FastAPI carga los artefactos XGBoost desde la carpeta configurada |
| Compilacion frontend | Verificada | `npm run build` genera la salida de Vite en `dist/` |
| Pruebas del backend | Verificadas | `npm test`: 2 pruebas aprobadas |
| Integracion frontend -> API | Pendiente | El dashboard sigue usando `RecommendationEngine` local |
| Prediccion PRECAUCION | Pendiente | El modelo actual solo devuelve `APROBADO` o `DENEGADO` |
| Indices de estres por IA | Pendiente | Los indices siguen siendo calculados por el motor local |

El frontend puede ejecutarse de forma independiente. Para una evaluacion real mediante API se deben iniciar tambien FastAPI y el backend de Node.js.

## Arquitectura

```text
index.html                  Entrada web
src/                        Dashboard y motor prescriptivo local
backend/                    API REST Node.js + Express
ai-service/                 Servicio de inferencia Python + FastAPI
docs/architecture.md        Contrato tecnico y limitaciones
ai-service/vendor/BatteryGuard/
                            Checkout local con los artefactos del modelo
```

El flujo disponible para la API es:

```text
Cliente -> POST /api/v1/recommendations/evaluate
        -> validacion y mapeo
        -> POST /predict
        -> modelo XGBoost
        -> prediccion y confianza
```

## Tecnologias

- Frontend: HTML5, JavaScript ES modules, Tailwind CSS y Vite
- Backend: Node.js 20+, Express 5, Zod y Fetch API
- IA: Python, FastAPI, Pydantic, pandas, scikit-learn y XGBoost
- Modelo: `battery_xgboost_v1.joblib` y `preprocessor.joblib`

## Ejecucion en Windows

### 1. Frontend

```powershell
npm install
npm run dev
```

Vite sirve el dashboard normalmente en `http://localhost:5173`.

Comandos disponibles:

```powershell
npm run build    # Compila el frontend
npm run preview  # Previsualiza la compilacion
npm run serve    # Sirve archivos con serve
```

### 2. Servicio de inferencia

Desde la raiz:

```powershell
.\ai-service\.venv\Scripts\Activate.ps1
python -m pip install -r ai-service\requirements.txt
$env:BATTERYGUARD_MODEL_DIR = (Resolve-Path .\ai-service\vendor\BatteryGuard\models).Path
python -m uvicorn app.main:app --app-dir ai-service --reload --port 8000
```

El servicio expone:

- `GET /health`
- `POST /predict`

Ejemplo de entrada:

```json
{
  "SOH": "Degradada",
  "Topografia": "Montanosa",
  "Clima": "Calor Extremo"
}
```

### 3. API Node

En otra terminal:

```powershell
Set-Location backend
Copy-Item .env.example .env
npm install
npm run dev
```

La API queda normalmente en `http://localhost:3000`.

Endpoints principales:

- `GET /api/v1/health`
- `POST /api/v1/recommendations/evaluate`

Ejemplo:

```powershell
$body = @{
  unit = "EV-100000"
  battery = "Mala"
  route = "Montaña"
  weather = "Extremo"
} | ConvertTo-Json

Invoke-RestMethod `
  -Uri "http://localhost:3000/api/v1/recommendations/evaluate" `
  -Method Post `
  -ContentType "application/json" `
  -Body $body
```

## Pruebas

```powershell
Set-Location backend
npm test
```

Las pruebas verifican el mapeo de valores del dashboard al esquema del modelo y el flujo de la ruta de recomendaciones con un servicio IA de prueba.

## Limitaciones conocidas

- El modelo recibe `SOH`, `Topografia` y `Clima`; no recibe el identificador de unidad ni calcula directamente los indices de estres.
- `Media` y `Mala` se agrupan como `Degradada`.
- `Urbana` se agrupa como `Plana`.
- `Frío` y `Cálido` se agrupan como `Templado`.
- El modelo devuelve solo dos etiquetas: `APROBADO` y `DENEGADO`.
- Las equivalencias de entrada deben ser validadas por el equipo de dominio antes de utilizar el sistema como soporte operativo.
- Los endpoints no sustituyen actualmente la logica prescriptiva completa del dashboard.

## Documentacion

- [Arquitectura y contrato tecnico](docs/architecture.md)
- [Integracion de BatteryGuard](ai-service/vendor/BatteryGuard/README.md)
