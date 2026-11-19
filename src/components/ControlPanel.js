/**
 * BatteryGuard AI - Componente Panel de Control
 * Formulario interactivo para parametrizar vehículo, batería, topografía y clima
 */

import { FORM_OPTIONS, FLEET_UNITS } from "../data/fleet.js";

export function renderControlPanel(currentValues = {}) {
  const {
    unit = "EV-100000",
    battery = "Buena",
    route = "Plana",
    weather = "Templado"
  } = currentValues;

  return `
    <section class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/80 shadow-xs mb-6" aria-labelledby="panel-title">
      <!-- Título de sección -->
      <div class="border-b border-gray-150 pb-3 mb-5">
        <h2 id="panel-title" class="text-lg font-bold text-gray-900 tracking-tight">Panel de Control</h2>
      </div>

      <form id="evaluation-form" class="space-y-4" onsubmit="event.preventDefault();">
        <!-- Campo: Unidad -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label for="input-unit" class="text-xs font-semibold text-gray-700">Unidad</label>
            <span class="text-[10px] text-gray-400">ID de Flota EV</span>
          </div>
          <div class="relative">
            <input 
              type="text" 
              id="input-unit" 
              name="unit" 
              value="${unit}" 
              placeholder="Ej. EV-100000"
              list="fleet-suggestions"
              class="w-full px-3.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-sm font-medium text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all"
              required
            />
            <datalist id="fleet-suggestions">
              ${FLEET_UNITS.map(f => `<option value="${f.id}">${f.model} (SoH: ${f.soh})</option>`).join("")}
            </datalist>
          </div>
        </div>

        <!-- Campo: Salud de la Batería -->
        <div>
          <label for="select-battery" class="block text-xs font-semibold text-gray-700 mb-1.5">Salud de la Bateria</label>
          <select 
            id="select-battery" 
            name="battery"
            class="w-full px-3.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-sm font-medium text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all cursor-pointer"
            required
          >
            <option value="" disabled ${!battery ? "selected" : ""}>Seleccionar...</option>
            ${FORM_OPTIONS.batteryHealth.map(opt => `
              <option value="${opt.value}" ${battery === opt.value ? "selected" : ""}>
                ${opt.label}
              </option>
            `).join("")}
          </select>
        </div>

        <!-- Campo: Topografía de la Ruta -->
        <div>
          <label for="select-route" class="block text-xs font-semibold text-gray-700 mb-1.5">Topografia de la Ruta</label>
          <select 
            id="select-route" 
            name="route"
            class="w-full px-3.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-sm font-medium text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all cursor-pointer"
            required
          >
            <option value="" disabled ${!route ? "selected" : ""}>Seleccionar...</option>
            ${FORM_OPTIONS.routeTopography.map(opt => `
              <option value="${opt.value}" ${route === opt.value ? "selected" : ""}>
                ${opt.label}
              </option>
            `).join("")}
          </select>
        </div>

        <!-- Campo: Clima Esperado -->
        <div>
          <label for="select-weather" class="block text-xs font-semibold text-gray-700 mb-1.5">Clima Esperado</label>
          <select 
            id="select-weather" 
            name="weather"
            class="w-full px-3.5 py-2.5 bg-gray-50/50 hover:bg-gray-50 focus:bg-white text-sm font-medium text-gray-800 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-none transition-all cursor-pointer"
            required
          >
            <option value="" disabled ${!weather ? "selected" : ""}>Seleccionar...</option>
            ${FORM_OPTIONS.expectedWeather.map(opt => `
              <option value="${opt.value}" ${weather === opt.value ? "selected" : ""}>
                ${opt.label}
              </option>
            `).join("")}
          </select>
        </div>

        <!-- Botones de Acción -->
        <div class="pt-2 space-y-2.5">
          <button 
            type="button" 
            id="btn-evaluate"
            class="w-full py-3.5 px-4 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Evaluar Asignacion
          </button>

          <button 
            type="button" 
            id="btn-reset"
            class="w-full py-3 px-4 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-600 hover:text-gray-800 font-semibold text-sm border border-gray-300 rounded-xl transition-all cursor-pointer"
          >
            Restablecer
          </button>
        </div>

        <!-- Indicador de desplazamiento (Mobile cue) -->
        <div class="pt-3 pb-1 flex flex-col items-center justify-center text-center">
          <span class="text-[11px] text-gray-400 font-medium">Desliza para ver resultados</span>
          <div class="w-10 h-1 bg-gray-300 rounded-full mt-2"></div>
        </div>
      </form>
    </section>
  `;
}
