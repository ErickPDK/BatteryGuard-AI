/**
 * BatteryGuard AI - Componente de Navegación y Barra de Herramientas
 * Proporciona barra de navegación rápida para móviles y switch de modo de vista (Mobile First vs Desktop Dashboard)
 */

export function renderBottomNav(activeTab = "panel") {
  return `
    <nav class="sticky bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-gray-200 py-2 px-4 flex items-center justify-around z-40 select-none sm:hidden">
      <!-- Botón Panel -->
      <button 
        type="button" 
        data-nav-target="section-panel"
        class="flex flex-col items-center gap-1 text-xs font-semibold py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === "panel" ? "text-blue-600 font-bold" : "text-gray-400 hover:text-gray-600"
        }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
        </svg>
        <span>Panel</span>
      </button>

      <!-- Botón Dictamen / Estrés -->
      <button 
        type="button" 
        data-nav-target="section-results"
        class="flex flex-col items-center gap-1 text-xs font-semibold py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === "results" ? "text-blue-600 font-bold" : "text-gray-400 hover:text-gray-600"
        }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
        <span>Resultados</span>
      </button>

      <!-- Botón Base de Conocimientos -->
      <button 
        type="button" 
        data-nav-target="section-knowledge"
        class="flex flex-col items-center gap-1 text-xs font-semibold py-1 px-3 rounded-xl transition-all cursor-pointer ${
          activeTab === "knowledge" ? "text-blue-600 font-bold" : "text-gray-400 hover:text-gray-600"
        }"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
        <span>Escenarios</span>
      </button>
    </nav>
  `;
}

export function renderViewSwitcher(currentMode = "auto") {
  return `
    <aside class="w-full bg-slate-900 text-slate-200 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 shadow-md z-50">
      <div class="flex items-center gap-2">
        <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span class="font-bold text-white tracking-wide">BatteryGuard AI</span>
        <span class="text-slate-400 hidden sm:inline">| Visualizador de Vistas PDF</span>
      </div>

      <!-- Selector de Modos de Vista -->
      <div class="flex items-center gap-1.5 bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs">
        <button 
          type="button" 
          data-view-mode="mobile" 
          class="mode-btn px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentMode === "mobile" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
          }"
          title="Vista Móvil (Páginas 1, 2, 3)"
        >
          <span>📱</span>
          <span>Móvil (Págs 1-3)</span>
        </button>

        <button 
          type="button" 
          data-view-mode="desktop" 
          class="mode-btn px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentMode === "desktop" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
          }"
          title="Vista Desktop (Página 4)"
        >
          <span>💻</span>
          <span>Desktop (Pág 4)</span>
        </button>

        <button 
          type="button" 
          data-view-mode="auto" 
          class="mode-btn px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
            currentMode === "auto" ? "bg-blue-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
          }"
          title="Adaptación Responsive Automática"
        >
          <span>🔄</span>
          <span>Responsive</span>
        </button>
      </div>
    </aside>
  `;
}

export function renderBrowserChrome() {
  return `
    <div class="w-full bg-gray-150 px-4 py-2 border-b border-gray-250 flex items-center gap-3 select-none">
      <div class="flex items-center gap-1.5">
        <span class="w-3 h-3 rounded-full bg-rose-400 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span>
        <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span>
      </div>
      <div class="flex-1 max-w-xl mx-auto bg-white rounded-lg px-3 py-1 text-center text-xs font-mono text-gray-600 border border-gray-200 flex items-center justify-center gap-1.5 shadow-2xs">
        <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
        <span>batteryguard.ai/dashboard</span>
      </div>
    </div>
  `;
}
