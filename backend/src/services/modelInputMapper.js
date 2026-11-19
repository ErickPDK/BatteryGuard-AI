const batteryMap = {
  Buena: "Optima",
  Media: "Degradada",
  Mala: "Degradada"
};

const routeMap = {
  Plana: "Plana",
  Urbana: "Plana",
  Montaña: "Montanosa"
};

const weatherMap = {
  Templado: "Templado",
  Frío: "Templado",
  Cálido: "Templado",
  Extremo: "Calor Extremo"
};

export function toModelInput({ battery, route, weather }) {
  return {
    SOH: batteryMap[battery] || "Optima",
    Topografia: routeMap[route] || "Plana",
    Clima: weatherMap[weather] || "Templado"
  };
}
