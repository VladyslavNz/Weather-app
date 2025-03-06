import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Разрешаем запросы отовсюду
  res.setHeader("Access-Control-Allow-Methods", "GET");

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!API_KEY) {
    return res.status(500).json({ error: "API key is missing" });
  }

  const { type, ...params } = req.query;

  if (!["weather", "forecast"].includes(type)) {
    return res.status(400).json({ error: "Invalid request type" });
  }

  try {
    const url = `${BASE_URL}/${type}`;
    const response = await axios.get(url, {
      params: { ...params, units: "metric", appid: API_KEY },
    });
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error in proxy:", error.message);
    res.status(500).json({ error: "Error fetching weather data." });
  }
}
