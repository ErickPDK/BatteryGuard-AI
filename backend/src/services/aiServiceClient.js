import { z } from "zod";

const indicesSchema = z.object({
  vulnerability: z.number().min(0).max(100),
  mechanicalDemand: z.number().min(0).max(100),
  thermalStress: z.number().min(0).max(100),
  combinedRisk: z.number().min(0).max(100)
});

const predictionSchema = z.object({
  classPrediction: z.number().int().optional(),
  label: z.string().optional(),
  binaryLabel: z.string().optional(),
  verdict: z.enum(["APROBADO", "PRECAUCION", "DENEGADO"]).default("APROBADO"),
  confidence: z.number().min(0).max(100),
  probabilities: z.object({
    safe: z.number(),
    failure: z.number()
  }).optional(),
  indices: indicesSchema.optional(),
  ruleId: z.string().optional(),
  justification: z.string().optional(),
  status: z.literal("success")
});

export async function requestPrediction(modelInput) {
  const baseUrl = process.env.AI_SERVICE_URL || "http://localhost:8000";
  const timeoutMs = Number(process.env.AI_SERVICE_TIMEOUT_MS || 5000);
  let response;

  try {
    response = await fetch(`${baseUrl.replace(/\/+$/, "")}/predict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(modelInput),
      signal: AbortSignal.timeout(timeoutMs)
    });
  } catch (cause) {
    const error = new Error("No fue posible comunicarse con el servicio de IA");
    error.status = 502;
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    const error = new Error(`El servicio de IA respondió con estado ${response.status}`);
    error.status = 502;
    throw error;
  }

  let body;
  try {
    body = await response.json();
  } catch (cause) {
    const error = new Error("El servicio de IA devolvió una respuesta inválida");
    error.status = 502;
    error.cause = cause;
    throw error;
  }

  // Compatibilidad: si el servicio devuelve 'label' pero no 'verdict'
  if (body && !body.verdict && body.label) {
    body.verdict = body.label === "DENEGADO" ? "DENEGADO" : "APROBADO";
  }

  const parsed = predictionSchema.safeParse(body);
  if (!parsed.success) {
    const error = new Error("La respuesta del servicio de IA no cumple el contrato esperado");
    error.status = 502;
    error.details = parsed.error.issues;
    throw error;
  }

  return parsed.data;
}
