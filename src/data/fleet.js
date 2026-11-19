/**
 * BatteryGuard AI - Flota de Vehículos Eléctricos y Opciones de Entrada
 */

export const FLEET_UNITS = [
  { id: "EV-100000", model: "BYD T3 Cargo", soh: "Buena", actualSoH: 96, mileage: "14,200 km" },
  { id: "EV-100105", model: "Renault Kangoo Z.E.", soh: "Media", actualSoH: 78, mileage: "68,400 km" },
  { id: "EV-100204", model: "Maxus eDeliver 3", soh: "Buena", actualSoH: 91, mileage: "22,500 km" },
  { id: "EV-100310", model: "Peugeot e-Expert", soh: "Mala", actualSoH: 64, mileage: "128,900 km" },
  { id: "EV-100450", model: "Mercedes-Benz eVito", soh: "Media", actualSoH: 74, mileage: "89,100 km" },
  { id: "EV-100522", model: "Ford E-Transit", soh: "Buena", actualSoH: 98, mileage: "8,900 km" }
];

export const FORM_OPTIONS = {
  batteryHealth: [
    { value: "Buena", label: "Buena (SoH > 85%)", desc: "Celdas óptimas, sin pérdida de capacidad" },
    { value: "Media", label: "Media (SoH 70% - 84%)", desc: "Degradación moderada por ciclos de carga" },
    { value: "Mala", label: "Mala (SoH < 70%)", desc: "Alta resistencia interna y sulfatación" }
  ],
  routeTopography: [
    { value: "Plana", label: "Plana (Bajo gradiente)", desc: "Vías expresas y terreno nivelado" },
    { value: "Urbana", label: "Urbana (Stop-and-go continuo)", desc: "Tráfico citadino y arranques frecuentes" },
    { value: "Montaña", label: "Montaña (Alta pendiente)", desc: "Desniveles pronunciados y regeneración exigente" }
  ],
  expectedWeather: [
    { value: "Templado", label: "Templado (18°C a 24°C)", desc: "Rango óptimo para química NMC/LFP" },
    { value: "Frío", label: "Frío (< 5°C)", desc: "Caída de eficiencia electroquímica" },
    { value: "Cálido", label: "Cálido (28°C a 35°C)", desc: "Demanda media de refrigeración de cabina y BMS" },
    { value: "Extremo", label: "Extremo (-5°C o > 38°C)", desc: "Estrés térmico y riesgo de degradación acelerada" }
  ]
};
