/**
 * BatteryGuard AI - Aplicación Principal (Orquestador de Estado y UI)
 */

import { RecommendationEngine } from "./services/recommendationEngine.js";
import { SCENARIOS } from "./data/scenarios.js";
import { renderStatusBar, renderHeader, renderKpis } from "./components/Header.js";
import { renderControlPanel } from "./components/ControlPanel.js";
import { renderPrescriptiveResult } from "./components/PrescriptiveResult.js";
import { renderStressChart } from "./components/StressChart.js";
import { renderKnowledgeBase } from "./components/KnowledgeBase.js";
import { renderBottomNav, renderViewSwitcher, renderBrowserChrome } from "./components/Navigation.js";

class BatteryGuardApp {
  constructor() {
    // Estado reactivo de la aplicación
    this.state = {
      viewMode: "auto", // 'auto' | 'mobile' | 'desktop'
      activeFilter: "Todas",
      activeScenarioId: 1,
      activeMobileTab: "panel",
      formValues: {
        unit: "EV-100000",
        battery: "Buena",
        route: "Plana",
        weather: "Templado"
      },
      currentAssessment: null
    };

    // Inicializar evaluación con el escenario 1
    this.state.currentAssessment = RecommendationEngine.evaluate(this.state.formValues);
  }

  init() {
    this.render();
    this.bindEvents();
  }

  /**
   * Renderiza la aplicación completa según el modo de visualización
   */
  render() {
    const root = document.getElementById("app");
    if (!root) return;

    const { viewMode, activeFilter, activeScenarioId, formValues, currentAssessment } = this.state;

    // Barra de herramientas superior para alternar vistas (Mobile vs Desktop)
    const viewSwitcherHtml = renderViewSwitcher(viewMode);

    let contentHtml = "";

    if (viewMode === "mobile") {
      // MODO SIMULADOR MÓVIL (Páginas 1, 2, 3)
      contentHtml = `
        <div class="min-h-screen bg-slate-900/90 py-6 px-3 flex flex-col items-center justify-center">
          <div class="mobile-device-shell w-full max-w-[410px] bg-white text-gray-900 flex flex-col shadow-2xl">
            ${renderStatusBar()}
            
            <div id="mobile-scroll-container" class="flex-1 overflow-y-auto px-4 py-4 space-y-2 pb-16">
              <!-- Header & KPIs (Página 1) -->
              <div id="section-panel" class="pt-1">
                ${renderHeader()}
                ${renderKpis()}
                ${renderControlPanel(formValues)}
              </div>

              <!-- Dictamen & Estrés (Página 2) -->
              <div id="section-results" class="pt-2">
                ${renderPrescriptiveResult(currentAssessment)}
                ${renderStressChart(currentAssessment.indices)}
              </div>

              <!-- Base de Conocimientos (Página 3) -->
              <div id="section-knowledge" class="pt-2">
                ${renderKnowledgeBase(activeFilter, activeScenarioId)}
              </div>
            </div>

            ${renderBottomNav(this.state.activeMobileTab)}
          </div>
        </div>
      `;
    } else if (viewMode === "desktop") {
      // MODO DESKTOP DASHBOARD (Página 4 y 8)
      contentHtml = `
        <div class="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
          <div class="w-full max-w-7xl bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            ${renderBrowserChrome()}
            
            <main class="p-6 lg:p-8 space-y-6">
              <!-- Top Header & KPIs en línea horizontal -->
              <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-2 border-b border-gray-150">
                <div>
                  <div class="flex items-center gap-2.5">
                    <h1 class="text-3xl font-black text-gray-900 tracking-tight">BatteryGuard AI</h1>
                    <span class="bg-blue-600 text-white text-xs font-semibold px-2.5 py-0.5 rounded-full">v2.1</span>
                  </div>
                  <p class="text-sm font-medium text-gray-600 mt-0.5">Dashboard Prescriptivo de Flota EV</p>
                  <p class="text-xs text-gray-400">Equipo: Ops Fleet Management</p>
                </div>

                <div class="w-full lg:w-auto">
                  ${renderKpis()}
                </div>
              </div>

              <!-- Layout de 2 Columnas -->
              <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <!-- Columna Izquierda: Panel de Control -->
                <div class="lg:col-span-5 xl:col-span-4">
                  ${renderControlPanel(formValues)}
                </div>

                <!-- Columna Derecha: Dictamen Prescriptivo e Índices de Estrés -->
                <div class="lg:col-span-7 xl:col-span-8 space-y-6">
                  ${renderPrescriptiveResult(currentAssessment)}
                  ${renderStressChart(currentAssessment.indices)}
                </div>
              </div>

              <!-- Base de Conocimientos a todo lo ancho -->
              <div class="pt-2">
                ${renderKnowledgeBase(activeFilter, activeScenarioId)}
              </div>
            </main>
          </div>
        </div>
      `;
    } else {
      // MODO RESPONSIVE AUTOMÁTICO (Mobile First puro con adaptación fluida a desktop)
      contentHtml = `
        <div class="min-h-screen bg-gray-50 flex flex-col">
          <!-- Status bar visible en móviles -->
          <div class="sm:hidden">
            ${renderStatusBar()}
          </div>

          <main class="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
            <!-- Header y KPIs -->
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
              ${renderHeader()}
              <div class="w-full lg:max-w-xl">
                ${renderKpis()}
              </div>
            </div>

            <!-- Grid Responsive Adaptable -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <!-- Panel de Control -->
              <div id="section-panel" class="lg:col-span-5 xl:col-span-4">
                ${renderControlPanel(formValues)}
              </div>

              <!-- Dictamen Prescriptivo & Gráfico de Estrés -->
              <div id="section-results" class="lg:col-span-7 xl:col-span-8 space-y-6">
                ${renderPrescriptiveResult(currentAssessment)}
                ${renderStressChart(currentAssessment.indices)}
              </div>
            </div>

            <!-- Base de Conocimientos -->
            <div id="section-knowledge" class="mt-6">
              ${renderKnowledgeBase(activeFilter, activeScenarioId)}
            </div>
          </main>

          ${renderBottomNav(this.state.activeMobileTab)}
        </div>
      `;
    }

    root.innerHTML = `
      ${viewSwitcherHtml}
      ${contentHtml}
    `;

    this.bindEvents();
  }

  /**
   * Vincula eventos de la interfaz
   */
  bindEvents() {
    // 1. Selector de Modo de Vista (Mobile / Desktop / Responsive)
    document.querySelectorAll("[data-view-mode]").forEach(btn => {
      btn.onclick = () => {
        const mode = btn.getAttribute("data-view-mode");
        this.state.viewMode = mode;
        this.render();
      };
    });

    // 2. Botón Evaluar Asignación
    const btnEvaluate = document.getElementById("btn-evaluate");
    if (btnEvaluate) {
      btnEvaluate.onclick = () => this.handleEvaluate();
    }

    // 3. Botón Restablecer
    const btnReset = document.getElementById("btn-reset");
    if (btnReset) {
      btnReset.onclick = () => this.handleReset();
    }

    // 4. Cambios en selects del formulario
    const form = document.getElementById("evaluation-form");
    if (form) {
      const inputs = form.querySelectorAll("input, select");
      inputs.forEach(input => {
        input.onchange = (e) => {
          this.state.formValues[e.target.name] = e.target.value;
        };
      });
    }

    // 5. Filtros de la Base de Conocimientos (Todas, Aprobadas, Precaución, Denegadas)
    document.querySelectorAll("[data-filter]").forEach(btn => {
      btn.onclick = () => {
        const filter = btn.getAttribute("data-filter");
        this.state.activeFilter = filter;
        this.render();
      };
    });

    // 6. Clic en filas de la tabla de escenarios (Carga rápida en el panel)
    document.querySelectorAll("[data-scenario-id]").forEach(row => {
      row.onclick = () => {
        const scenarioId = parseInt(row.getAttribute("data-scenario-id"), 10);
        this.loadScenario(scenarioId);
      };
    });

    // 7. Simulación rápida desde píldoras de veredicto
    document.querySelectorAll("[data-simulate-verdict]").forEach(btn => {
      btn.onclick = () => {
        const targetVerdict = btn.getAttribute("data-simulate-verdict");
        const found = SCENARIOS.find(s => s.verdict === targetVerdict);
        if (found) {
          this.loadScenario(found.id);
        }
      };
    });

    // 8. Navegación rápida inferior en móvil
    document.querySelectorAll("[data-nav-target]").forEach(btn => {
      btn.onclick = () => {
        const targetId = btn.getAttribute("data-nav-target");
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    });
  }

  handleEvaluate() {
    const unitInput = document.getElementById("input-unit");
    const batterySelect = document.getElementById("select-battery");
    const routeSelect = document.getElementById("select-route");
    const weatherSelect = document.getElementById("select-weather");

    const unit = unitInput?.value.trim() || "EV-100000";
    const battery = batterySelect?.value || "Buena";
    const route = routeSelect?.value || "Plana";
    const weather = weatherSelect?.value || "Templado";

    this.state.formValues = { unit, battery, route, weather };
    this.state.currentAssessment = RecommendationEngine.evaluate(this.state.formValues);
    this.state.activeScenarioId = this.state.currentAssessment.matchedScenarioId;

    this.render();

    // Scroll suave hacia los resultados en móvil
    const resultsSection = document.getElementById("section-results");
    if (resultsSection && window.innerWidth < 1024) {
      setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  }

  handleReset() {
    this.state.formValues = {
      unit: "EV-100000",
      battery: "Buena",
      route: "Plana",
      weather: "Templado"
    };
    this.state.activeScenarioId = 1;
    this.state.currentAssessment = RecommendationEngine.evaluate(this.state.formValues);
    this.render();
  }

  loadScenario(scenarioId) {
    const sc = SCENARIOS.find(s => s.id === scenarioId);
    if (!sc) return;

    this.state.activeScenarioId = sc.id;
    this.state.formValues = {
      unit: this.state.formValues.unit || "EV-100000",
      battery: sc.battery,
      route: sc.route,
      weather: sc.weather
    };

    this.state.currentAssessment = RecommendationEngine.evaluate(this.state.formValues);
    this.render();

    // Feedback visual suave
    const resultsSection = document.getElementById("section-results");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }
}

// Iniciar aplicación cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  const app = new BatteryGuardApp();
  app.init();
});
