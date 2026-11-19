import { z } from "zod";

const predictionSchema = z.object({
  classPrediction: z.number().int(),
  label: z.enum(["APROBADO", "DENEGADO"]),
  confidence: z.number().min(0).max(100),
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

  const parsed = predictionSchema.safeParse(body);
  if (!parsed.success) {
    const error = new Error("La respuesta del servicio de IA no cumple el contrato esperado");
    error.status = 502;
    error.details = parsed.error.issues;
    throw error;
  }

  return parsed.data;
}
