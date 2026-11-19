/**
 * BatteryGuard AI - Base de Conocimientos: 8 Escenarios Operativos
 * Datos extraídos de la especificación técnica del sistema de asignación de rutas EV
 */

export const SCENARIOS = [
  {
    id: 1,
    name: "Óptimo general",
    battery: "Buena",
    route: "Plana",
    weather: "Templado",
    vulnerability: 15,
    mechanicalDemand: 10,
    thermalStress: 8,
    combinedRisk: 12,
    verdict: "Aprobado",
    ruleId: "R-001: Batería saludable + Ruta plana + Clima templado",
    justification: "La unidad EV-100000 cumple todos los criterios de seguridad para la ruta asignada. Riesgo combinado bajo con degradación química mínima."
  },
  {
    id: 2,
    name: "Ruta montaña",
    battery: "Buena",
    route: "Montaña",
    weather: "Templado",
    vulnerability: 35,
    mechanicalDemand: 55,
    thermalStress: 20,
    combinedRisk: 42,
    verdict: "Precaucion",
    ruleId: "R-002: Batería saludable + Gradiente elevado + Regeneración intensa",
    justification: "La exigencia mecánica en pendientes pronunciadas incrementa la temperatura de celdas. Se recomienda monitorear SoH y frenado regenerativo."
  },
  {
    id: 3,
    name: "Clima extremo",
    battery: "Buena",
    route: "Plana",
    weather: "Extremo",
    vulnerability: 60,
    mechanicalDemand: 30,
    thermalStress: 85,
    combinedRisk: 78,
    verdict: "Denegado",
    ruleId: "R-003: Temperatura ambiental crítica + Sobrecarga de climatización BMS",
    justification: "El sistema térmico de la batería operará al límite para evitar embalamiento térmico. Alto riesgo de degradación acelerada e ineficiencia severa."
  },
  {
    id: 4,
    name: "Batería degradada",
    battery: "Mala",
    route: "Plana",
    weather: "Templado",
    vulnerability: 80,
    mechanicalDemand: 25,
    thermalStress: 30,
    combinedRisk: 72,
    verdict: "Denegado",
    ruleId: "R-004: SoH crítico (<70%) + Resistencia interna elevada",
    justification: "La unidad presenta degradación avanzada de capacidad. Asignar rutas regulares provocará caídas bruscas de voltaje y riesgo de detención en vía."
  },
  {
    id: 5,
    name: "Carga parcial",
    battery: "Media",
    route: "Plana",
    weather: "Templado",
    vulnerability: 25,
    mechanicalDemand: 15,
    thermalStress: 12,
    combinedRisk: 20,
    verdict: "Aprobado",
    ruleId: "R-005: Estado de salud intermedio + Ruta de bajo impacto mecánico",
    justification: "Parámetros dentro de la ventana segura de operación. Ciclo de descarga suave compatible con la vida útil restante estimada."
  },
  {
    id: 6,
    name: "Urbano nocturno",
    battery: "Buena",
    route: "Urbana",
    weather: "Frío",
    vulnerability: 20,
    mechanicalDemand: 12,
    thermalStress: 18,
    combinedRisk: 18,
    verdict: "Aprobado",
    ruleId: "R-006: Topografía plana con paradas frecuentes + Temperatura moderadamente baja",
    justification: "La baja demanda de potencia sostenida y el régimen urbano mantienen las celdas en rango térmico seguro. Aprobación garantizada."
  },
  {
    id: 7,
    name: "Carga + montaña",
    battery: "Media",
    route: "Montaña",
    weather: "Cálido",
    vulnerability: 45,
    mechanicalDemand: 60,
    thermalStress: 35,
    combinedRisk: 55,
    verdict: "Precaucion",
    ruleId: "R-007: Batería media + Alta demanda de par motor + Calor ambiental",
    justification: "El vehículo completará la ruta pero sufrirá calentamiento focalizado en módulos centrales. Se requiere limitar la velocidad máxima a 75 km/h."
  },
  {
    id: 8,
    name: "Peor caso",
    battery: "Mala",
    route: "Montaña",
    weather: "Extremo",
    vulnerability: 90,
    mechanicalDemand: 85,
    thermalStress: 92,
    combinedRisk: 95,
    verdict: "Denegado",
    ruleId: "R-008: Falla multifactorial simultánea (SoH degradado + Pendiente + Clima adverso)",
    justification: "Bloqueo preventivo imperativo. La demanda energética excede con creces la capacidad remanente y el sistema de refrigeración colapsaría."
  }
];

export const KPI_METRICS = {
  scenarioCoverage: "8/8",
  scenarioCoverageLabel: "Cobertura de escenarios",
  scenarioCoverageSub: "escenarios cubiertos",
  safeAssignmentsRate: "94%",
  safeAssignmentsLabel: "Asignaciones seguras",
  safeAssignmentsSub: "tasa de aprobacion",
  preventiveBlocksCount: "3",
  preventiveBlocksLabel: "Bloqueos preventivos",
  preventiveBlocksSub: "unidades bloqueadas"
};
