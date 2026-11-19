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

    response.json({
      unit: parsed.data.unit,
      model: "battery_xgboost_v1",
      modelInput,
      modelLimitations: [
        "El modelo solo predice APROBADO o DENEGADO; no predice PRECAUCION ni índices de estrés.",
        "Media y Mala se agrupan como Degradada; Urbana como Plana; Frío y Cálido como Templado."
      ],
      prediction
    });
  } catch (error) {
    next(error);
  }
});

export { router as recommendationRoutes };
