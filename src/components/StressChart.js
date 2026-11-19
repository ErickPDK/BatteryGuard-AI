/**
 * BatteryGuard AI - Componente Índices de Estrés (Gráfico de Barras)
 * Renderiza gráfico de barras con eje porcentual (0%-100%), guías de nivel,
 * barras dinámicas animadas y leyenda técnica.
 */

export function renderStressChart(indices = {}) {
  const {
    vulnerability = 35,
    mechanicalDemand = 22,
    thermalStress = 18,
    combinedRisk = 28
  } = indices;

  // Altura del área del gráfico en píxeles
  const chartHeightPx = 200;

  // Cálculo de alturas porcentuales seguras entre 0% y 100%
  const hVuln = Math.min(Math.max(vulnerability, 2), 100);
  const hMech = Math.min(Math.max(mechanicalDemand, 2), 100);
  const hTherm = Math.min(Math.max(thermalStress, 2), 100);
  const hComb = Math.min(Math.max(combinedRisk, 2), 100);

  return `
    <section class="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200/90 shadow-xs mb-6" aria-labelledby="chart-title">
      <div class="border-b border-gray-150 pb-3 mb-5">
        <h2 id="chart-title" class="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          Indices de Estres
        </h2>
      </div>

      <!-- Contenedor del Gráfico con Eje Y -->
      <div class="relative w-full pt-2 pb-6">
        <!-- Eje Y y Líneas Guía -->
        <div class="relative" style="height: ${chartHeightPx}px;">
          
          <!-- Línea 100% -->
          <div class="absolute inset-x-0 top-0 flex items-center">
            <span class="text-[10px] text-gray-400 font-medium w-8 text-right pr-2 select-none">100%</span>
            <div class="flex-1 border-b border-gray-200/80"></div>
          </div>

          <!-- Línea 75% -->
          <div class="absolute inset-x-0 top-1/4 flex items-center">
            <span class="text-[10px] text-gray-400 font-medium w-8 text-right pr-2 select-none">75%</span>
            <div class="flex-1 border-b border-gray-150"></div>
          </div>

          <!-- Línea 50% -->
          <div class="absolute inset-x-0 top-2/4 flex items-center">
            <span class="text-[10px] text-gray-400 font-medium w-8 text-right pr-2 select-none">50%</span>
            <div class="flex-1 border-b border-gray-150"></div>
          </div>

          <!-- Línea 25% -->
          <div class="absolute inset-x-0 top-3/4 flex items-center">
            <span class="text-[10px] text-gray-400 font-medium w-8 text-right pr-2 select-none">25%</span>
            <div class="flex-1 border-b border-gray-150"></div>
          </div>

          <!-- Línea Base 0% -->
          <div class="absolute inset-x-0 bottom-0 flex items-center">
            <span class="text-[10px] text-gray-400 font-medium w-8 text-right pr-2 select-none">0%</span>
            <div class="flex-1 border-b-2 border-gray-300"></div>
          </div>

          <!-- Área de las 4 Barras -->
          <div class="absolute inset-0 left-9 flex items-end justify-around px-2 sm:px-6">
            
            <!-- Barra 1: Vulnerabilidad -->
            <div class="flex flex-col items-center w-12 sm:w-16 group">
              <span class="text-xs font-bold text-blue-600 mb-1.5 transition-all">
                ${vulnerability}%
              </span>
              <div 
                class="w-10 sm:w-12 bg-blue-500 rounded-t-lg shadow-xs stress-bar-animate hover:bg-blue-600 cursor-pointer"
                style="height: ${(hVuln / 100) * (chartHeightPx - 26)}px;"
                title="Vulnerabilidad: ${vulnerability}%"
              ></div>
            </div>

            <!-- Barra 2: Exigencia Mecánica -->
            <div class="flex flex-col items-center w-12 sm:w-16 group">
              <span class="text-xs font-bold text-emerald-600 mb-1.5 transition-all">
                ${mechanicalDemand}%
              </span>
              <div 
                class="w-10 sm:w-12 bg-emerald-500 rounded-t-lg shadow-xs stress-bar-animate hover:bg-emerald-600 cursor-pointer"
                style="height: ${(hMech / 100) * (chartHeightPx - 26)}px;"
                title="Exigencia Mecánica: ${mechanicalDemand}%"
              ></div>
            </div>

            <!-- Barra 3: Estrés Térmico -->
            <div class="flex flex-col items-center w-12 sm:w-16 group">
              <span class="text-xs font-bold text-amber-500 mb-1.5 transition-all">
                ${thermalStress}%
              </span>
              <div 
                class="w-10 sm:w-12 bg-amber-400 rounded-t-lg shadow-xs stress-bar-animate hover:bg-amber-500 cursor-pointer"
                style="height: ${(hTherm / 100) * (chartHeightPx - 26)}px;"
                title="Estrés Térmico: ${thermalStress}%"
              ></div>
            </div>

            <!-- Barra 4: Riesgo Combinado -->
            <div class="flex flex-col items-center w-12 sm:w-16 group">
              <span class="text-xs font-bold text-rose-500 mb-1.5 transition-all">
                ${combinedRisk}%
              </span>
              <div 
                class="w-10 sm:w-12 bg-rose-500 rounded-t-lg shadow-xs stress-bar-animate hover:bg-rose-600 cursor-pointer"
                style="height: ${(hComb / 100) * (chartHeightPx - 26)}px;"
                title="Riesgo Combinado: ${combinedRisk}%"
              ></div>
            </div>

          </div>
        </div>

        <!-- Etiquetas Eje X -->
        <div class="flex items-center justify-around pl-9 pr-2 sm:px-6 pt-2 select-none">
          <div class="w-12 sm:w-16 text-center text-[10px] sm:text-xs font-medium text-gray-500">Vulnerab.</div>
          <div class="w-12 sm:w-16 text-center text-[10px] sm:text-xs font-medium text-gray-500">Exig. Mec.</div>
          <div class="w-12 sm:w-16 text-center text-[10px] sm:text-xs font-medium text-gray-500">Estres Term.</div>
          <div class="w-12 sm:w-16 text-center text-[10px] sm:text-xs font-medium text-gray-500">Riesgo Comb.</div>
        </div>
      </div>

      <!-- Leyenda Inferior (idéntica al PDF) -->
      <div class="pt-2 border-t border-gray-100 grid grid-cols-2 sm:flex sm:flex-wrap sm:justify-center gap-x-4 gap-y-2 text-xs text-gray-600">
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-sm bg-blue-500 shrink-0"></span>
          <span class="text-[11px] sm:text-xs font-medium text-gray-700">Vulnerabilidad</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-sm bg-emerald-500 shrink-0"></span>
          <span class="text-[11px] sm:text-xs font-medium text-gray-700">Exig. Mecanica</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-sm bg-amber-400 shrink-0"></span>
          <span class="text-[11px] sm:text-xs font-medium text-gray-700">Estres Termico</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="w-3.5 h-3.5 rounded-sm bg-rose-500 shrink-0"></span>
          <span class="text-[11px] sm:text-xs font-medium text-gray-700">Riesgo Combinado</span>
        </div>
      </div>
    </section>
  `;
}
