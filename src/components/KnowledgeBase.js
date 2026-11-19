/**
 * BatteryGuard AI - Componente Base de Conocimientos: Escenarios Operativos
 * Muestra los 8 escenarios operativos con filtros dinámicos (Todas, Aprobadas, Precaución, Denegadas),
 * vista adaptativa para móviles (compacta) y escritorio (expandida), y carga interactiva de escenarios.
 */

import { SCENARIOS } from "../data/scenarios.js";

export function renderKnowledgeBase(activeFilter = "Todas", activeScenarioId = null) {
  // Filtrado de escenarios
  const filteredScenarios = SCENARIOS.filter(scenario => {
    if (activeFilter === "Todas") return true;
    if (activeFilter === "Aprobadas") return scenario.verdict === "Aprobado";
    if (activeFilter === "Precaucion") return scenario.verdict === "Precaucion";
    if (activeFilter === "Denegadas") return scenario.verdict === "Denegado";
    return true;
  });

  // Conteo para badges
  const counts = {
    all: SCENARIOS.length,
    aprobadas: SCENARIOS.filter(s => s.verdict === "Aprobado").length,
    precaucion: SCENARIOS.filter(s => s.verdict === "Precaucion").length,
    denegadas: SCENARIOS.filter(s => s.verdict === "Denegado").length,
  };

  return `
    <section class="mb-8" aria-labelledby="kb-title">
      <!-- Título de sección -->
      <h2 id="kb-title" class="text-base sm:text-lg font-bold text-gray-900 tracking-tight mb-3">
        Base de Conocimientos
      </h2>

      <!-- Píldoras de Filtros (idénticas a la página 3 y 4) -->
      <div class="grid grid-cols-4 gap-2 mb-4" role="tablist" aria-label="Filtro de escenarios">
        <!-- Filtro: Todas -->
        <button 
          type="button" 
          data-filter="Todas"
          class="kb-filter-btn py-2 px-1 text-center font-bold text-xs rounded-xl transition-all cursor-pointer select-none ${
            activeFilter === "Todas"
              ? "bg-blue-600 text-white shadow-xs"
              : "bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
          }"
        >
          Todas <span class="hidden sm:inline">(${counts.all})</span>
        </button>

        <!-- Filtro: Aprobadas -->
        <button 
          type="button" 
          data-filter="Aprobadas"
          class="kb-filter-btn py-2 px-1 text-center font-bold text-xs rounded-xl transition-all cursor-pointer select-none ${
            activeFilter === "Aprobadas"
              ? "bg-emerald-500 text-white shadow-xs ring-2 ring-emerald-300"
              : "bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          }"
        >
          Aprobadas <span class="hidden sm:inline">(${counts.aprobadas})</span>
        </button>

        <!-- Filtro: Precaución -->
        <button 
          type="button" 
          data-filter="Precaucion"
          class="kb-filter-btn py-2 px-1 text-center font-bold text-xs rounded-xl transition-all cursor-pointer select-none ${
            activeFilter === "Precaucion"
              ? "bg-amber-400 text-amber-950 shadow-xs ring-2 ring-amber-300"
              : "bg-white border-2 border-amber-400 text-amber-500 hover:bg-amber-50"
          }"
        >
          Precaucion <span class="hidden sm:inline">(${counts.precaucion})</span>
        </button>

        <!-- Filtro: Denegadas -->
        <button 
          type="button" 
          data-filter="Denegadas"
          class="kb-filter-btn py-2 px-1 text-center font-bold text-xs rounded-xl transition-all cursor-pointer select-none ${
            activeFilter === "Denegadas"
              ? "bg-rose-500 text-white shadow-xs ring-2 ring-rose-300"
              : "bg-white border-2 border-rose-500 text-rose-500 hover:bg-rose-50"
          }"
        >
          Denegadas <span class="hidden sm:inline">(${counts.denegadas})</span>
        </button>
      </div>

      <!-- Card Contenedora con Tabla de Escenarios -->
      <div class="bg-white rounded-3xl p-4 sm:p-6 border border-gray-200/90 shadow-xs overflow-hidden">
        <div class="border-b border-gray-150 pb-3 mb-3 flex items-center justify-between">
          <h3 class="text-sm sm:text-base font-bold text-gray-900">
            ${filteredScenarios.length} Escenarios Operativos
          </h3>
          <span class="text-[11px] text-gray-400 hidden sm:block">
            Haz clic en un escenario para cargarlo en el panel
          </span>
        </div>

        <!-- Tabla Responsive -->
        <div class="overflow-x-auto -mx-4 sm:mx-0">
          <table class="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr class="text-gray-400 border-b border-gray-150 text-[11px] font-semibold uppercase tracking-wider">
                <th class="py-2.5 px-3 w-8">#</th>
                <th class="py-2.5 px-3">Escenario</th>
                <th class="py-2.5 px-3">Bateria</th>
                <th class="py-2.5 px-3">Ruta</th>
                <!-- Columnas visibles solo en Desktop / Tablet -->
                <th class="py-2.5 px-3 hidden lg:table-cell">Clima</th>
                <th class="py-2.5 px-3 hidden lg:table-cell text-center">Vulnerab.</th>
                <th class="py-2.5 px-3 hidden lg:table-cell text-center">Exig. Mec.</th>
                <th class="py-2.5 px-3 hidden lg:table-cell text-center">Estres Term.</th>
                <th class="py-2.5 px-3 hidden lg:table-cell text-center">Riesgo Comb.</th>
                <!-- Fin columnas desktop -->
                <th class="py-2.5 px-3 text-right">Dictamen</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              ${filteredScenarios.map(sc => {
                const isSelected = activeScenarioId === sc.id;
                
                // Estilo del badge según veredicto
                let badgeClass = "bg-emerald-500 text-white";
                let badgeText = "Aprobado";
                if (sc.verdict === "Precaucion") {
                  badgeClass = "bg-amber-400 text-amber-950 font-bold";
                  badgeText = "Precaucion";
                } else if (sc.verdict === "Denegado") {
                  badgeClass = "bg-rose-500 text-white";
                  badgeText = "Denegado";
                }

                return `
                  <tr 
                    data-scenario-id="${sc.id}"
                    class="scenario-row hover:bg-blue-50/60 transition-colors cursor-pointer group ${
                      isSelected ? "bg-blue-50/80 font-medium" : ""
                    }"
                    title="Cargar escenario: ${sc.name}"
                  >
                    <td class="py-3 px-3 text-gray-400 font-mono text-xs">${sc.id}</td>
                    <td class="py-3 px-3 font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                      ${sc.name}
                    </td>
                    <td class="py-3 px-3 text-gray-600">${sc.battery}</td>
                    <td class="py-3 px-3 text-gray-600">${sc.route}</td>
                    
                    <!-- Datos extendidos para desktop -->
                    <td class="py-3 px-3 text-gray-600 hidden lg:table-cell">${sc.weather}</td>
                    <td class="py-3 px-3 text-gray-700 hidden lg:table-cell text-center font-mono">${sc.vulnerability}%</td>
                    <td class="py-3 px-3 text-gray-700 hidden lg:table-cell text-center font-mono">${sc.mechanicalDemand}%</td>
                    <td class="py-3 px-3 text-gray-700 hidden lg:table-cell text-center font-mono">${sc.thermalStress}%</td>
                    <td class="py-3 px-3 text-gray-900 font-bold hidden lg:table-cell text-center font-mono">${sc.combinedRisk}%</td>
                    
                    <td class="py-3 px-3 text-right whitespace-nowrap">
                      <span class="inline-block px-3 py-1 text-[11px] font-bold rounded-lg shadow-2xs ${badgeClass}">
                        ${badgeText}
                      </span>
                    </td>
                  </tr>
                `;
              }).join("")}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  `;
}
