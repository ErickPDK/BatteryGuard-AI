import assert from "node:assert/strict";
import test from "node:test";
import { toModelInput } from "../src/services/modelInputMapper.js";

test("maps the dashboard options to the model's training categories", () => {
  assert.deepEqual(
    toModelInput({ battery: "Media", route: "Urbana", weather: "Frío" }),
    { SOH: "Degradada", Topografia: "Plana", Clima: "Templado" }
  );
  assert.deepEqual(
    toModelInput({ battery: "Buena", route: "Montaña", weather: "Extremo" }),
    { SOH: "Optima", Topografia: "Montanosa", Clima: "Calor Extremo" }
  );
});
