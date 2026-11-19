# BatteryGuard AI - Arquitectura del Sistema de Recomendación

## 1. Visión General
**BatteryGuard AI** es una solución integral de analítica prescriptiva diseñada bajo el enfoque **Mobile-First** para la gestión operativa y asignación inteligente de vehículos eléctricos (EV) a rutas de reparto o transporte.

El sistema analiza en tiempo real el estado de desgaste de la batería (**State of Health - SoH**), la topografía de la ruta y las condiciones climáticas pronosticadas para prescribir si un vehículo debe ser:
- 🟢 **APROBADO**: Despacho seguro con degradación mínima.
- 🟡 **PRECAUCIÓN**: Despacho condicional con telemetría intensiva y límite de descarga.
- 🔴 **DENEGADO**: Bloqueo preventivo imperativo ante riesgo de paro en vía o degradación irreversible.

---

## 2. Estructura del Sistema

```text
IA/
├── index.html                   # Punto de entrada web con meta viewport móvil
├── package.json                 # Scripts Vite del Frontend
├── src/                         # Código fuente del Frontend
│   ├── app.js                   # Orquestador reactivo de interfaz y llamadas asíncronas
│   ├── components/              # Componentes de UI (Header, Panel, Dictamen, Barras, etc.)
│   ├── data/                    # Matriz de 8 escenarios y catálogo de unidades EV
│   └── services/                # recommendationEngine.js con cliente API y fallback local
├── backend/                     # API REST Gateway (Node.js + Express 5 + Zod)
│   ├── package.json
│   ├── .env.example
│   ├── src/
│   │   ├── app.js               # Configuración Express y CORS
│   │   ├── server.js            # Servidor HTTP en puerto 3000
│   │   ├── routes/              # recommendationRoutes.js (/api/v1/recommendations)
│   │   ├── middleware/          # errorHandler.js
│   │   └── services/            # aiServiceClient.js y modelInputMapper.js
│   └── test/                    # Pruebas automatizadas (node:test)
├── ai-service/                  # Microservicio de Inferencia (Python 3.11 + FastAPI + Uvicorn)
│   ├── app/main.py              # Inferencia XGBoost, cálculo de índices y reglas prescriptivas
│   ├── requirements.txt         # Dependencias fijadas y estables
│   └── vendor/BatteryGuard/     # Repositorio base con artefactos entrenados
│       └── models/
│           ├── battery_xgboost_v1.joblib
│           └── preprocessor.joblib
└── docs/architecture.md         # Este documento técnico
```

---

## 3. Variables de Entrada y Dimensiones de Análisis

| Dimensión | Opciones del Dashboard | Mapeo Canónico XGBoost | Impacto Físico en el Pack EV |
| :--- | :--- | :--- | :--- |
| **Salud Batería (SoH)** | Buena (>85%), Media (70-84%), Mala (<70%) | `Optima` (Buena) / `Degradada` (Media, Mala) | Resistencia interna, riesgo de caída brusca de tensión (*voltage sag*). |
| **Topografía** | Plana, Urbana, Montaña | `Plana` (Plana, Urbana) / `Montanosa` (Montaña) | Demanda de par motor (*torque*), corrientes C-rate sostenidas y regeneración. |
| **Clima Esperado** | Templado, Frío, Cálido, Extremo | `Templado` (Templado, Frío, Cálido) / `Calor Extremo` (Extremo) | Eficiencia electroquímica y carga sobre el sistema de refrigeración líquida/BMS. |

---

## 4. Índices de Estrés Evaluados por la IA

El servicio de inferencia calcula numéricamente los 4 índices de estrés porcentual (0-100%):

1. **Vulnerabilidad (Azul):** Sensibilidad intrínseca del pack a la pérdida irreversible de capacidad, calculada a partir del SoH del vehículo y ajustada con la probabilidad de falla emitida por XGBoost.
2. **Exigencia Mecánica (Verde):** Carga motriz y estrés de potencia cinemática impuestos por el gradiente de elevación o paradas continuas.
3. **Estrés Térmico (Amarillo):** Temperatura interna proyectada en los módulos de celdas por sobrecarga térmica y temperatura ambiental.
4. **Riesgo Combinado (Rojo):** Índice ponderado de riesgo de detención en ruta:
   $$\text{Riesgo Combinado} = 0.40 \cdot \text{Vuln} + 0.30 \cdot \text{Mec} + 0.30 \cdot \text{Térm}$$
   Alineado y calibrado con la probabilidad de clase 1 de XGBoost: $P(\text{Falla})$.

---

## 5. Inferencia Prescriptiva Tri-Estado (APROBADO, PRECAUCIÓN, DENEGADO)

A diferencia del clasificador binario puro de laboratorio, el servicio de inferencia prescriptiva (`ai-service/app/main.py`) opera en 3 zonas:

* **APROBADO:** $\text{Riesgo Combinado} \le 25\%$ y parámetros térmicos seguros.
* **PRECAUCIÓN:** $26\% \le \text{Riesgo Combinado} \le 60\%$. Típico en rutas de montaña con batería intermedia o climas exigentes sin riesgo inminente de apagado.
* **DENEGADO:** $\text{Riesgo Combinado} > 60\%$ o vulnerabilidad/estrés térmico crítico ($\ge 75\%$). Se activa el bloqueo preventivo del vehículo.

---

## 6. Contrato de la API

### Inferencia en FastAPI (`POST http://localhost:8000/predict`)

**Payload de entrada:**
```json
{
  "unit": "EV-100000",
  "battery": "Buena",
  "route": "Montaña",
  "weather": "Templado"
}
```

**Respuesta:**
```json
{
  "unit": "EV-100000",
  "inputMapped": {
    "battery": "Buena",
    "route": "Montaña",
    "weather": "Templado",
    "canonical": { "SOH": "Optima", "Topografia": "Montanosa", "Clima": "Templado" }
  },
  "classPrediction": 0,
  "binaryLabel": "APROBADO",
  "verdict": "PRECAUCION",
  "confidence": 79.1,
  "probabilities": { "safe": 79.1, "failure": 20.9 },
  "indices": {
    "vulnerability": 15,
    "mechanicalDemand": 53,
    "thermalStress": 20,
    "combinedRisk": 28
  },
  "ruleId": "R-002: Despacho condicional (Montaña + Batería Buena)",
  "justification": "Se autoriza asignación condicional para EV-100000. El vehículo puede operar pero la exigencia mecánica o térmica aconseja limitar velocidad y monitorear telemetría.",
  "status": "success"
}
```

### Gateway Node.js (`POST http://localhost:3000/api/v1/recommendations/evaluate`)

Valida la entrada con Zod, orquesta la llamada a FastAPI y devuelve los datos enriquecidos directamente consumibles por el Dashboard web. Si la API no está en línea, el Frontend activa automáticamente su motor local en memoria para no interrumpir la experiencia de usuario.
