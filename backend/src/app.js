import cors from "cors";
import express from "express";
import { errorHandler } from "./middleware/errorHandler.js";
import { recommendationRoutes } from "./routes/recommendationRoutes.js";

export function createApp() {
  const app = express();

  const allowedOrigins = [
    process.env.FRONTEND_ORIGIN,
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5500"
  ].filter(Boolean);

  app.use(cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origen (curl, pruebas) o cualquier origen local en desarrollo
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      return callback(new Error("Bloqueado por política CORS"));
    }
  }));
  app.use(express.json({ limit: "16kb" }));

  app.get("/api/v1/health", (_request, response) => {
    response.json({ status: "ok", service: "batteryguard-api" });
  });
  app.use("/api/v1/recommendations", recommendationRoutes);
  app.use(errorHandler);

  return app;
}
