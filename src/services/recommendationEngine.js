/**
 * BatteryGuard AI - Recommendation & Prescriptive Analytics Engine
 * Evalúa el desgaste de la batería vs condiciones de ruta y clima para generar dictámenes prescriptivos
 */

import { SCENARIOS } from "../data/scenarios.js";

export class RecommendationEngine {
  /**
   * Evalúa la viabilidad de asignación para un vehículo eléctrico
   * @param {Object} params
   * @param {string} params.unit - Identificador del vehículo (ej: 'EV-100000')
   * @param {string} params.battery - Estado de la batería ('Buena', 'Media', 'Mala')
   * @param {string} params.route - Topografía de la ruta ('Plana', 'Urbana', 'Montaña')
   * @param {string} params.weather - Clima esperado ('Templado', 'Frío', 'Cálido', 'Extremo')
   * @returns {Object} Resultado del dictamen prescriptivo con índices de estrés
   */
  static evaluate({ unit = "EV-100000", battery, route, weather }) {
    // 1. Buscar coincidencia exacta en los 8 escenarios de la base de conocimientos
    const exactMatch = SCENARIOS.find(s => 
      s.battery.toLowerCase() === (battery || "").toLowerCase() &&
      s.route.toLowerCase() === (route || "").toLowerCase() &&
      s.weather.toLowerCase() === (weather || "").toLowerCase()
    );

    if (exactMatch) {
      return {
        unit: unit || "EV-100000",
        battery: exactMatch.battery,
        route: exactMatch.route,
        weather: exactMatch.weather,
        verdict: exactMatch.verdict, // 'Aprobado' | 'Precaucion' | 'Denegado'
        ruleId: exactMatch.ruleId,
        justification: exactMatch.justification.replace("EV-100000", unit || "EV-100000"),
        indices: {
          vulnerability: exactMatch.vulnerability,
          mechanicalDemand: exactMatch.mechanicalDemand,
          thermalStress: exactMatch.thermalStress,
          combinedRisk: exactMatch.combinedRisk
        },
        matchedScenarioId: exactMatch.id
      };
    }

    // 2. Si no hay coincidencia directa, calcular heurística de degradación y estrés
    return this._calculateDynamicAssessment({ unit, battery, route, weather });
  }

  static _calculateDynamicAssessment({ unit, battery, route, weather }) {
    // Valores de vulnerabilidad base según salud de batería
    let vuln = 20;
    if (battery === "Media") vuln = 35;
    if (battery === "Mala") vuln = 80;

    // Factores mecánicos según topografía
    let mech = 10;
    if (route === "Urbana") mech = 15;
    if (route === "Montaña") mech = 58;

    // Estrés térmico según clima
    let therm = 10;
    if (weather === "Frío") therm = 25;
    if (weather === "Cálido") therm = 38;
    if (weather === "Extremo") therm = 86;

    // Ajustes cruzados (efecto acoplado)
    if (route === "Montaña" && weather === "Cálido") {
      therm += 15;
      mech += 5;
    }
    if (battery === "Mala" && weather === "Extremo") {
      vuln += 12;
      therm += 8;
    }

    // Normalizar a rangos [5, 98]
    vuln = Math.min(Math.max(vuln, 5), 98);
    mech = Math.min(Math.max(mech, 5), 98);
    therm = Math.min(Math.max(therm, 5), 98);

    // Riesgo combinado ponderado: 40% vulnerabilidad + 30% mecánico + 30% térmico
    const combined = Math.min(
      Math.round(vuln * 0.4 + mech * 0.3 + therm * 0.3),
      99
    );

    // Determinar Dictamen Prescriptivo
    let verdict = "Aprobado";
    let rulePrefix = "R-101";
    let ruleText = "Condición operativa segura";
    let justification = `La unidad ${unit || "EV-100000"} presenta margen operativo adecuado. Niveles de estrés bajo umbrales críticos de degradación.`;

    if (combined > 60 || vuln >= 75 || therm >= 80) {
      verdict = "Denegado";
      rulePrefix = "R-109";
      ruleText = "Bloqueo preventivo: Umbral de riesgo crítico sobrepasado";
      justification = `Asignación bloqueada preventivamente para ${unit || "EV-100000"}. El perfil de estrés aceleraría la degradación irreversible de la química de las celdas o generaría apagado imprevisto.`;
    } else if (combined >= 35 || mech >= 50 || therm >= 50) {
      verdict = "Precaucion";
      rulePrefix = "R-105";
      ruleText = "Despacho condicional con telemetría intensiva";
      justification = `Se autoriza asignación con advertencia para ${unit || "EV-100000"}. Se requiere supervisión de temperatura en tiempo real y no exceder límites de descarga rápida.`;
    }

    return {
      unit: unit || "EV-100000",
      battery: battery || "Buena",
      route: route || "Plana",
      weather: weather || "Templado",
      verdict,
      ruleId: `${rulePrefix}: ${ruleText} (${battery || "Buena"} + ${route || "Plana"} + ${weather || "Templado"})`,
      justification,
      indices: {
        vulnerability: vuln,
        mechanicalDemand: mech,
        thermalStress: therm,
        combinedRisk: combined
      },
      matchedScenarioId: null
    };
  }
}
