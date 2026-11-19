# 🔋 BatteryGuard AI — Dashboard Prescriptivo de Asignación de Rutas EV

> Sistema inteligente para flotas de vehículos eléctricos (EV) que utiliza analítica prescriptiva e IA para recomendar la asignación óptima de rutas según el estado de salud de la batería (**SoH**), topografía del terreno y condiciones climáticas.

---

## 📱 Vistas del Sistema (Diseño Mobile-First Fiel al PDF)

Este frontend fue construido siguiendo al 100% los diagramas y wireframes de especificación técnica del PDF:

1. **Página 1 (Mobile - Inicio y Configuración):**
   - Barra de estado móvil superior (*9:41 AM, 100% batería*).
   - Branding: **BatteryGuard AI** (badge `v2.1`), subtítulo *"Dashboard Prescriptivo de Flota EV"* y equipo *"Ops Fleet Management"*.
   - 3 Tarjetas KPI principales:
     - **Cobertura de escenarios:** `8/8`
     - **Asignaciones seguras:** `94%` (verde esmeralda)
     - **Bloqueos preventivos:** `3` (rojo preventivo)
   - **Panel de Control:** Selector de unidad (`EV-100000`), Salud de Batería (`Buena`, `Media`, `Mala`), Topografía de Ruta (`Plana`, `Urbana`, `Montaña`) y Clima Esperado (`Templado`, `Frío`, `Cálido`, `Extremo`), con botones de **Evaluar Asignación** y **Restablecer**, más el indicador *"Desliza para ver resultados"*.

2. **Página 2 (Mobile - Resultados & Dictamen):**
   - **Dictamen Prescriptivo:** Card de veredicto con bordes e insignias dinámicas (`APROBADO`, `PRECAUCION`, `DENEGADO`).
   - Caja de **Regla activada** (ej. `R-001: Bateria saludable + Ruta plana + Clima templado`).
   - Párrafo de **Justificación técnica** explicativa generada por la IA.
   - Píldoras de acceso rápido a los otros estados.
   - **Índices de Estrés:** Gráfica de barras verticales calibrada al 100% con líneas guía:
     - 🟦 **Vulnerabilidad** (35%)
     - 🟩 **Exigencia Mecánica** (22%)
     - 🟨 **Estrés Térmico** (18%)
     - 🟥 **Riesgo Combinado** (28%)
     - Leyenda inferior interactiva con indicadores circulares por color.

3. **Página 3 (Mobile - Base de Conocimientos):**
   - Filtros de estado: `Todas`, `Aprobadas`, `Precaucion`, `Denegadas`.
   - Listado de los **8 Escenarios Operativos** oficiales con sus columnas (`#`, `Escenario`, `Bateria`, `Ruta`, `Dictamen`).
   - Interacción: Al tocar cualquier escenario de la lista, se carga inmediatamente en el Panel de Control y recalcula la evaluación.

4. **Página 4 (Desktop - Dashboard Integral):**
   - Distribución responsive en pantalla completa con barra superior simulada `batteryguard.ai/dashboard`.
   - Disposición en 2 columnas: Columna izquierda con el Panel de Control y Columna derecha con Dictamen Prescriptivo e Índices de Estrés.
   - Tabla expandida a ancho completo con métricas detalladas para cada escenario.

---

## 📂 Estructura del Sistema de Carpetas

La arquitectura de archivos fue diseñada siguiendo los estándares modernos para proyectos Frontend escalables y listos para Git:

```text
batteryguard-ai/
├── index.html                   # Punto de entrada HTML5 con Tailwind CSS
├── package.json                 # Definición del proyecto, scripts y dependencias
├── .gitignore                   # Archivo de ignorados estándar para Git
├── README.md                    # Guía principal del proyecto
├── docs/
│   └── architecture.md          # Especificación técnica, reglas e índices de estrés
└── src/
    ├── app.js                   # Orquestador del estado de la aplicación y eventos
    ├── components/              # Componentes de interfaz modulares y reutilizables
    │   ├── Header.js            # StatusBar móvil, branding institucional y KPIs
    │   ├── ControlPanel.js      # Formulario reactivo de evaluación de unidad y ruta
    │   ├── PrescriptiveResult.js# Card de veredicto, regla activada y justificación técnica
    │   ├── StressChart.js       # Gráfico de barras de Índices de Estrés (0-100%)
    │   ├── KnowledgeBase.js     # Base de conocimientos de 8 escenarios y filtros
    │   └── Navigation.js        # Barra inferior móvil y selector de vista
    ├── data/                    # Datos estáticos y telemetría simulada
    │   ├── scenarios.js         # Los 8 escenarios operativos oficiales del PDF
    │   └── fleet.js             # Catálogo de vehículos EV y opciones de formulario
    ├── services/                # Capa de lógica de negocio y analítica
    │   └── recommendationEngine.js # Motor prescriptivo e inferencia de desgaste
    └── styles/                  # Hojas de estilo y diseño
        └── main.css             # Estilos de Tailwind, animaciones y mobile shell
```

---

## 🚀 Cómo Ejecutar el Proyecto

Tienes dos opciones muy sencillas:

### Opción 1: Sin instalación (Directo en el navegador)
Simplemente haz doble clic o abre el archivo `index.html` en tu navegador favorito (Chrome, Edge, Firefox, Safari). Tailwind CSS y todos los módulos cargarán de forma instantánea.

### Opción 2: Con servidor local (Vite / Node.js)
Si deseas ejecutarlo como un proyecto Node con recarga en caliente:

```bash
# 1. Ingresar a la carpeta del proyecto
cd batteryguard-ai

# 2. Instalar dependencias de desarrollo
npm install

# 3. Iniciar el servidor local
npm run dev
```

---

## 📦 Cómo Agregar a un Nuevo Repositorio Git

Para crear tu propio repositorio Git con esta base de código:

```bash
# 1. Ubicarse en el directorio del proyecto
cd batteryguard-ai

# 2. Inicializar el repositorio Git
git init

# 3. Agregar todos los archivos estructurados
git add .

# 4. Crear el commit inicial
git commit -m "feat: frontend mobile-first BatteryGuard AI v2.1 con Tailwind CSS y motor prescriptivo"

# 5. Conectar con tu repositorio remoto (GitHub, GitLab, Bitbucket, etc.)
git branch -M main
git remote add origin https://github.com/TU_USUARIO/batteryguard-ai.git
git push -u origin main
```

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 Semántico:** Estructura accesible (`header`, `main`, `section`, `nav`, `aside`).
- **Tailwind CSS:** Diseño mobile-first con utilidades modernas y paleta cromática de alta fidelidad.
- **JavaScript Moderno (ES6+ Modules):** Componentes limpios sin dependencias pesadas, listos para portar a React, Vue, Svelte o Next.js.
- **Inter Font:** Tipografía clara y moderna para dashboards corporativos de transporte.

## Preparación del backend y el modelo

Se agregó una API REST independiente en `backend/` (Node.js + Express) y un servicio de inferencia en `ai-service/` (Python + FastAPI). El modelo sigue viviendo en su repositorio original: [AsaelCastilloArana/BatteryGuard](https://github.com/AsaelCastilloArana/BatteryGuard); sus datos y artefactos no se copian a este proyecto.

Consulta [`docs/architecture.md`](docs/architecture.md) para el contrato, las limitaciones del modelo y los pasos de instalación y ejecución en Windows. El dashboard todavía usa su motor local; la integración de la interfaz con la API queda como siguiente paso.
