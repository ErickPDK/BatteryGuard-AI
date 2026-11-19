/**
 * BatteryGuard AI - Componente Dictamen Prescriptivo
 * Visualiza la decisión técnica de IA: APROBADO, PRECAUCION o DENEGADO,
 * junto con la regla operativa activada y la justificación técnica.
 */

export function renderPrescriptiveResult(assessment) {
  const verdict = assessment.verdict || "Aprobado";
  const ruleId = assessment.ruleId || "R-001: Bateria saludable + Ruta plana + Clima templado";
  const justification = assessment.justification || 
    "La unidad EV-100000 cumple todos los criterios de seguridad para la ruta asignada. Riesgo combinado bajo.";

  // Configuración cromática y visual según el dictamen
  const verdictConfig = {
    Aprobado: {
      borderClass: "border-2 border-emerald-500 bg-emerald-50/20",
      dotClass: "bg-emerald-500 ring-4 ring-emerald-500/20",
      textClass: "text-emerald-600",
      label: "APROBADO",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>`
    },
    Precaucion: {
      borderClass: "border-2 border-amber-400 bg-amber-50/20",
      dotClass: "bg-amber-400 ring-4 ring-amber-400/20",
      textClass: "text-amber-500",
      label: "PRECAUCION",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/></svg>`
    },
    Denegado: {
      borderClass: "border-2 border-rose-500 bg-rose-50/20",
      dotClass: "bg-rose-500 ring-4 ring-rose-500/20",
      textClass: "text-rose-600",
      label: "DENEGADO",
      icon: `<svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>`
    }
  };

  const current = verdictConfig[verdict] || verdictConfig.Aprobado;

  return `
    <section class="mb-6" aria-labelledby="dictamen-title">
      <!-- Título de sección -->
      <h2 id="dictamen-title" class="text-base sm:text-lg font-bold text-gray-900 tracking-tight mb-3">
        Dictamen Prescriptivo
      </h2>

      <!-- Card Principal del Dictamen -->
      <div class="bg-white rounded-3xl p-5 border border-gray-200/90 shadow-xs mb-3">
        <!-- Badge de Veredicto Principal -->
        <div class="w-full ${current.borderClass} rounded-2xl p-4 flex items-center gap-3.5 mb-4 transition-all duration-300">
          <div class="w-9 h-9 rounded-full ${current.dotClass} flex items-center justify-center shrink-0">
            ${current.icon}
          </div>
          <span class="text-xl sm:text-2xl font-black ${current.textClass} tracking-wide">
            ${current.label}
          </span>
        </div>

        <!-- Regla Activada -->
        <div class="mb-3.5">
          <span class="text-xs font-semibold text-gray-700 block mb-1.5">Regla activada</span>
          <div class="bg-gray-100/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-800 break-words border border-gray-200/50">
            ${ruleId}
          </div>
        </div>

        <!-- Justificación Técnica -->
        <div>
          <span class="text-xs font-semibold text-gray-700 block mb-1">Justificacion tecnica</span>
          <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
            ${justification}
          </p>
        </div>
      </div>

      <!-- Selector o píldoras secundarias de visualización rápida (exactas a la página 2 del PDF) -->
      <div class="grid grid-cols-2 gap-3" aria-label="Simulación de otros dictámenes">
        <button 
          type="button" 
          data-simulate-verdict="Precaucion" 
          class="verdict-pill-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border-2 border-amber-400/80 bg-amber-50/30 hover:bg-amber-100/50 transition-all cursor-pointer ${verdict === 'Precaucion' ? 'ring-2 ring-amber-400' : ''}"
        >
          <span class="w-3.5 h-3.5 rounded-full bg-amber-400"></span>
          <span class="text-xs font-bold text-amber-600 uppercase tracking-wide">PRECAUCION</span>
        </button>

        <button 
          type="button" 
          data-simulate-verdict="Denegado" 
          class="verdict-pill-btn flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl border-2 border-rose-400/80 bg-rose-50/30 hover:bg-rose-100/50 transition-all cursor-pointer ${verdict === 'Denegado' ? 'ring-2 ring-rose-400' : ''}"
        >
          <span class="w-3.5 h-3.5 rounded-full bg-rose-500"></span>
          <span class="text-xs font-bold text-rose-600 uppercase tracking-wide">DENEGADO</span>
        </button>
      </div>
    </section>
  `;
}
