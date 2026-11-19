/**
 * BatteryGuard AI - Recommendation & Prescriptive Analytics Engine
 * Conecta el frontend con la API Node.js (que consume el microservicio de IA FastAPI)
 * y provee fallback local automático si la API está desconectada.
 */

import { SCENARIOS } from "../data/scenarios.js";

const DEFAULT_API_BASE = "http://localhost:3000";

export class RecommendationEngine {
  /**
   * Evalúa la viabilidad de asignación consultando la API en vivo o usando fallback local.
   * @param {Object} params
   * @param {string} params.unit - Identificador del vehículo
   * @param {string} params.battery - Estado de la batería ('Buena', 'Media', 'Mala')
   * @param {string} params.route - Topografía de la ruta ('Plana', 'Urbana', 'Montaña')
   * @param {string} params.weather - Clima esperado ('Templado', 'Frío', 'Cálido', 'Extremo')
   * @returns {Promise<Object>} Resultado del dictamen prescriptivo con índices de estrés
   */
  static async evaluate({ unit = "EV-100000", battery = "Buena", route = "Plana", weather = "Templado" }) {
    try {
      const response = await fetch(`${DEFAULT_API_BASE}/api/v1/recommendations/evaluate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unit, battery, route, weather }),
        signal: AbortSignal.timeout(3000)
      });

      if (response.ok) {
        const data = await response.json();
        return {
          unit: data.unit || unit,
          battery: data.battery || battery,
          route: data.route || route,
          weather: data.weather || weather,
          verdict: data.verdict || "Aprobado", // 'Aprobado' | 'Precaucion' | 'Denegado'
          ruleId: data.ruleId,
          justification: data.justification,
          indices: data.indices || {
            vulnerability: 20,
            mechanicalDemand: 20,
            thermalStress: 20,
            combinedRisk: 20
          },
          confidence: data.confidence,
          probabilities: data.probabilities,
          matchedScenarioId: this._findMatchingScenarioId(battery, route, weather),
          source: "api"
        };
      }
    } catch {
      // Fallback transparente al motor local si la API está apagada o no responde
    }

    return this.evaluateLocal({ unit, battery, route, weather });
  }

  /**
   * Evaluación síncrona / offline local basada en la base de conocimientos y heurística
   */
  static evaluateLocal({ unit = "EV-100000", battery = "Buena", route = "Plana", weather = "Templado" }) {
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
        verdict: exactMatch.verdict,
        ruleId: exactMatch.ruleId,
        justification: exactMatch.justification.replace("EV-100000", unit || "EV-100000"),
        indices: {
          vulnerability: exactMatch.vulnerability,
          mechanicalDemand: exactMatch.mechanicalDemand,
          thermalStress: exactMatch.thermalStress,
          combinedRisk: exactMatch.combinedRisk
        },
        matchedScenarioId: exactMatch.id,
        source: "local"
      };
    }

    return this._calculateDynamicAssessment({ unit, battery, route, weather });
  }

  static _findMatchingScenarioId(battery, route, weather) {
    const found = SCENARIOS.find(s => 
      s.battery.toLowerCase() === (battery || "").toLowerCase() &&
      s.route.toLowerCase() === (route || "").toLowerCase() &&
      s.weather.toLowerCase() === (weather || "").toLowerCase()
    );
    return found ? found.id : null;
  }

  static _calculateDynamicAssessment({ unit, battery, route, weather }) {
    let vuln = 20;
    if (battery === "Media") vuln = 35;
    if (battery === "Mala") vuln = 80;

    let mech = 10;
    if (route === "Urbana") mech = 15;
    if (route === "Montaña") mech = 58;

    let therm = 10;
    if (weather === "Frío") therm = 25;
    if (weather === "Cálido") therm = 38;
    if (weather === "Extremo") therm = 86;

    if (route === "Montaña" && weather === "Cálido") {
      therm += 15;
      mech += 5;
    }
    if (battery === "Mala" && weather === "Extremo") {
      vuln += 12;
      therm += 8;
    }

    vuln = Math.min(Math.max(vuln, 5), 98);
    mech = Math.min(Math.max(mech, 5), 98);
    therm = Math.min(Math.max(therm, 5), 98);

    const combined = Math.min(
      Math.round(vuln * 0.4 + mech * 0.3 + therm * 0.3),
      99
    );

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
      matchedScenarioId: null,
      source: "local"
    };
  }
}
