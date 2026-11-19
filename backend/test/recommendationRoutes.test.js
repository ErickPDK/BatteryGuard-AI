import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "node:http";
import test from "node:test";
import { createApp } from "../src/app.js";

function closeServer(server) {
  return new Promise((resolve, reject) => {
    server.close(error => error ? reject(error) : resolve());
  });
}

test("validates the evaluation request and forwards the mapped model input", async () => {
  let receivedModelInput;
  const aiServer = createServer(async (request, response) => {
    const chunks = [];
    for await (const chunk of request) chunks.push(chunk);
    receivedModelInput = JSON.parse(Buffer.concat(chunks).toString());
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({
      classPrediction: 1,
      label: "DENEGADO",
      confidence: 91.25,
      status: "success"
    }));
  });
  aiServer.listen(0, "127.0.0.1");
  await once(aiServer, "listening");

  const previousAiUrl = process.env.AI_SERVICE_URL;
  process.env.AI_SERVICE_URL = `http://127.0.0.1:${aiServer.address().port}`;
  const apiServer = createApp().listen(0, "127.0.0.1");
  await once(apiServer, "listening");

  try {
    const baseUrl = `http://127.0.0.1:${apiServer.address().port}`;
    const invalidResponse = await fetch(`${baseUrl}/api/v1/recommendations/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ battery: "Desconocida", route: "Plana", weather: "Templado" })
    });
    assert.equal(invalidResponse.status, 400);

    const response = await fetch(`${baseUrl}/api/v1/recommendations/evaluate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ battery: "Mala", route: "Montaña", weather: "Extremo" })
    });
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(receivedModelInput, {
      SOH: "Degradada",
      Topografia: "Montanosa",
      Clima: "Calor Extremo"
    });
    assert.equal(body.prediction.label, "DENEGADO");
    assert.equal(body.model, "battery_xgboost_v1");
  } finally {
    if (previousAiUrl === undefined) delete process.env.AI_SERVICE_URL;
    else process.env.AI_SERVICE_URL = previousAiUrl;
    await Promise.all([closeServer(apiServer), closeServer(aiServer)]);
  }
});
