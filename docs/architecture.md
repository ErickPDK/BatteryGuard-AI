# BatteryGuard AI - Arquitectura del Sistema de Recomendación

## 1. Visión General
**BatteryGuard AI** es una solución Frontend de analítica prescriptiva diseñada bajo el enfoque **Mobile-First** para la gestión operativa y asignación inteligente de vehículos eléctricos (EV) a rutas de reparto o transporte.

El sistema analiza en tiempo real el estado de desgaste de la batería (**State of Health - SoH**), la topografía de la ruta y las condiciones climáticas pronosticadas para prescribir si un vehículo debe ser **APROBADO**, despachado con **PRECAUCIÓN** o **DENEGADO (Bloqueo preventivo)** para evitar fallas en vía y degradación acelerada de las celdas.

---

## 2. Estructura del sistema
```text
batteryguard-ai/
├── index.html
├── package.json                 # Frontend Vite
├── src/                         # Dashboard y motor local actual
├── backend/                     # API REST en Node.js + Express
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── services/            # Adaptador de entrada y cliente del servicio IA
│   └── test/
├── ai-service/                  # API de inferencia Python + FastAPI
│   ├── app/main.py
│   └── requirements.txt
└── docs/architecture.md
```

---

## 3. Variables de Entrada y Dimensiones de Análisis

| Dimensión | Valores Posibles | Impacto Físico en el Vehículo EV |
| :--- | :--- | :--- |
| **Salud Batería (SoH)** | Buena (>85%), Media (70-84%), Mala (<70%) | Resistencia interna del pack, riesgo de caída de tensión bajo carga (*voltage sag*). |
| **Topografía** | Plana, Urbana, Montaña | Demanda de par motriz (*torque*), corrientes C-rate sostenidas y estrés por regeneración. |
| **Clima Esperado** | Templado, Frío, Cálido, Extremo | Eficiencia electroquímica, sobrecarga del sistema de refrigeración líquida o calefacción de cabina. |

---

## 4. Índices de Estrés Evaluados

1. **Vulnerabilidad (Azul):** Sensibilidad del pack de baterías a la degradación irreparable según su salud actual (SoH) y fatiga previa.
2. **Exigencia Mecánica (Verde):** Carga motriz requerida por la topografía y gradiente de elevación.
3. **Estrés Térmico (Amarillo):** Temperatura proyectada en los módulos de celdas por la interacción entre clima y potencia.
4. **Riesgo Combinado (Rojo):** Índice ponderado de riesgo de detención en ruta o pérdida de ciclo de vida acelerado.

---

## 5. Matriz de los 8 Escenarios Operativos

| # | Escenario | Batería | Topografía | Clima | Vuln. | Exig. Mec. | Estrés Térm. | Riesgo Comb. | Dictamen |
|---|---|---|---|---|---|---|---|---|---|
| 1 | Óptimo general | Buena | Plana | Templado | 15% | 10% | 8% | 12% | **Aprobado** |
| 2 | Ruta montaña | Buena | Montaña | Templado | 35% | 55% | 20% | 42% | **Precaución** |
| 3 | Clima extremo | Buena | Plana | Extremo | 60% | 30% | 85% | 78% | **Denegado** |
| 4 | Batería degradada | Mala | Plana | Templado | 80% | 25% | 30% | 72% | **Denegado** |
| 5 | Carga parcial | Media | Plana | Templado | 25% | 15% | 12% | 20% | **Aprobado** |
| 6 | Urbano nocturno | Buena | Urbana | Frío | 20% | 12% | 18% | 18% | **Aprobado** |
| 7 | Carga + montaña | Media | Montaña | Cálido | 45% | 60% | 35% | 55% | **Precaución** |
| 8 | Peor caso | Mala | Montaña | Extremo | 90% | 85% | 92% | 95% | **Denegado** |

---

## 6. API Node y servicio de inferencia

La API Node (`backend/`) expone:

- `GET /api/v1/health`: estado de la API.
- `POST /api/v1/recommendations/evaluate`: recibe `{ "unit", "battery", "route", "weather" }`, valida los datos, adapta las categorías y llama al servicio IA.

El servicio Python (`ai-service/`) expone `POST /predict` y carga `battery_xgboost_v1.joblib` y `preprocessor.joblib` desde el repositorio externo [BatteryGuard](https://github.com/AsaelCastilloArana/BatteryGuard). Los artefactos no se copian ni se versionan en este proyecto. `BATTERYGUARD_MODEL_DIR` debe apuntar a la carpeta `models` de ese checkout.

El modelo existente solo predice `APROBADO` o `DENEGADO` con tres variables categóricas. No calcula `PRECAUCION` ni los índices de estrés del dashboard. Para adaptar las opciones actuales del formulario a las categorías con las que se entrenó, la API agrupa `Media/Mala` como `Degradada`, `Urbana` como `Plana`, y `Frío/Cálido` como `Templado`; estas simplificaciones se devuelven explícitamente en la respuesta. Revisar y validar estas equivalencias con el equipo de dominio antes de usar predicciones en operaciones reales.

La interfaz existente todavía usa su motor local en `src/services/recommendationEngine.js`; conectar y adaptar su respuesta al nuevo contrato es un siguiente paso, no parte de esta estructura inicial.

### Ejecución local (Windows PowerShell)

Desde la raíz del proyecto:

```powershell
git clone git@github.com:AsaelCastilloArana/BatteryGuard.git ai-service\vendor\BatteryGuard
python -m pip install -r ai-service\vendor\BatteryGuard\requirements.txt
python -m pip install -r ai-service\requirements.txt
$env:BATTERYGUARD_MODEL_DIR = (Resolve-Path .\ai-service\vendor\BatteryGuard\models).Path
python -m uvicorn app.main:app --app-dir ai-service --reload --port 8000
```

En otra terminal, desde la raíz:

```powershell
Set-Location backend
Copy-Item .env.example .env
npm install
npm run dev
```

El frontend sigue arrancándose desde la raíz con `npm install` y `npm run dev`. Para probar el endpoint Node, enviar un `POST` JSON a `http://localhost:3000/api/v1/recommendations/evaluate`.
