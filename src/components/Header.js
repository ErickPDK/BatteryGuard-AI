/**
 * BatteryGuard AI - Componente Header y KPIs de Flota
 * Renderiza Status Bar móvil, branding institucional y tarjetas métricas
 */

import { KPI_METRICS } from "../data/scenarios.js";

export function renderStatusBar() {
  return `
    <div class="w-full bg-gray-100/90 backdrop-blur-sm px-6 py-2 flex items-center justify-between text-xs font-semibold text-gray-700 select-none border-b border-gray-200/50">
      <span class="tracking-tight font-medium text-gray-800">9:41 AM</span>
      <div class="flex items-center gap-1.5 text-gray-700">
        <!-- Señal Celular -->
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 18.25A10.94 10.94 0 0 1 1 12C1 5.92 5.92 1 12 1s11 4.92 11 11c0 2.33-.73 4.49-1.97 6.25l-.62-.64C21.46 16.07 22 14.12 22 12c0-4.97-4.03-9-9-9z"/>
          <circle cx="12" cy="18" r="2"/>
        </svg>
        <!-- WiFi -->
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.002 19.5v.01" />
        </svg>
        <!-- Batería -->
        <span class="text-[11px] font-bold text-gray-800 ml-0.5">100%</span>
        <div class="w-5 h-2.5 border border-gray-700 rounded-sm p-[1px] flex items-center">
          <div class="h-full w-full bg-gray-800 rounded-2xs"></div>
        </div>
      </div>
    </div>
  `;
}

export function renderHeader() {
  return `
    <header class="mb-4">
      <div class="flex items-start justify-between">
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-2xl font-extrabold text-gray-900 tracking-tight">BatteryGuard AI</h1>
            <span class="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full shadow-xs">v2.1</span>
          </div>
          <p class="text-sm font-medium text-gray-700 mt-0.5">Dashboard Prescriptivo de Flota EV</p>
          <p class="text-xs text-gray-400 mt-0.5">Equipo: Ops Fleet Management</p>
        </div>
      </div>
    </header>
  `;
}

export function renderKpis() {
  return `
    <section class="grid grid-cols-3 gap-2.5 sm:gap-4 mb-5" aria-label="KPIs de Operación">
      <!-- Cobertura -->
      <div class="bg-white rounded-2xl p-3 sm:p-4 border border-gray-150 shadow-xs flex flex-col justify-between">
        <span class="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight">
          ${KPI_METRICS.scenarioCoverageLabel}
        </span>
        <div class="mt-2">
          <span class="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            ${KPI_METRICS.scenarioCoverage}
          </span>
          <p class="text-[10px] text-gray-400 hidden sm:block mt-0.5">
            ${KPI_METRICS.scenarioCoverageSub}
          </p>
        </div>
      </div>

      <!-- Asignaciones seguras -->
      <div class="bg-white rounded-2xl p-3 sm:p-4 border border-gray-150 shadow-xs flex flex-col justify-between">
        <span class="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight">
          ${KPI_METRICS.safeAssignmentsLabel}
        </span>
        <div class="mt-2">
          <span class="text-2xl sm:text-3xl font-black text-emerald-500 tracking-tight">
            ${KPI_METRICS.safeAssignmentsRate}
          </span>
          <p class="text-[10px] text-gray-400 hidden sm:block mt-0.5">
            ${KPI_METRICS.safeAssignmentsSub}
          </p>
        </div>
      </div>

      <!-- Bloqueos preventivos -->
      <div class="bg-white rounded-2xl p-3 sm:p-4 border border-gray-150 shadow-xs flex flex-col justify-between">
        <span class="text-[11px] sm:text-xs text-gray-500 font-medium leading-tight">
          ${KPI_METRICS.preventiveBlocksLabel}
        </span>
        <div class="mt-2">
          <span class="text-2xl sm:text-3xl font-black text-rose-500 tracking-tight">
            ${KPI_METRICS.preventiveBlocksCount}
          </span>
          <p class="text-[10px] text-gray-400 hidden sm:block mt-0.5">
            ${KPI_METRICS.preventiveBlocksSub}
          </p>
        </div>
      </div>
    </section>
  `;
}
