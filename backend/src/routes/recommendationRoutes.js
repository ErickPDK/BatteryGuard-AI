import { Router } from "express";
import { z } from "zod";
import { requestPrediction } from "../services/aiServiceClient.js";
import { toModelInput } from "../services/modelInputMapper.js";

const router = Router();

const evaluationSchema = z.object({
  unit: z.string().trim().min(1).max(40).default("EV-100000"),
  battery: z.enum(["Buena", "Media", "Mala"]),
  route: z.enum(["Plana", "Urbana", "Montaña"]),
  weather: z.enum(["Templado", "Frío", "Cálido", "Extremo"])
}).strict();

function normalizeVerdict(rawVerdict) {
  if (!rawVerdict) return "Aprobado";
  const upper = rawVerdict.toUpperCase();
  if (upper.includes("PRECAUCION") || upper.includes("PRECAUCIÓN")) return "Precaucion";
  if (upper.includes("DENEGADO")) return "Denegado";
  return "Aprobado";
}

router.post("/evaluate", async (request, response, next) => {
  const parsed = evaluationSchema.safeParse(request.body);
  if (!parsed.success) {
    response.status(400).json({
      error: {
        message: "Los datos de evaluación no son válidos",
        details: parsed.error.issues.map(({ path, message }) => ({
          field: path.join("."),
          message
        }))
      }
    });
    return;
  }

  try {
    const modelInput = toModelInput(parsed.data);
    const prediction = await requestPrediction(modelInput);

    const normalizedVerdict = normalizeVerdict(prediction.verdict || prediction.label);

    response.json({
      unit: parsed.data.unit,
      battery: parsed.data.battery,
      route: parsed.data.route,
      weather: parsed.data.weather,
      verdict: normalizedVerdict,
      verdictRaw: prediction.verdict || prediction.label || "APROBADO",
      confidence: prediction.confidence,
      probabilities: prediction.probabilities,
      indices: prediction.indices || {
        vulnerability: 20,
        mechanicalDemand: 20,
        thermalStress: 20,
        combinedRisk: 20
      },
      ruleId: prediction.ruleId || `R-001: Condición operativa evaluada (${parsed.data.battery} + ${parsed.data.route})`,
      justification: prediction.justification || `Evaluación técnica para ${parsed.data.unit}.`,
      model: "battery_xgboost_v1",
      modelInput: {
        SOH: modelInput.SOH,
        Topografia: modelInput.Topografia,
        Clima: modelInput.Clima
      },
      prediction,
      source: "ai-service"
    });
  } catch (error) {
    next(error);
  }
});

export { router as recommendationRoutes };
