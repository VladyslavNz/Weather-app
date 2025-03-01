import axios from "axios";

// Убираем прямой API_KEY и BASE_URL

export const fetchWeatherData = async (location) => {
  try {
    const response = await axios.get("/api/openweather", {
      params: { type: "weather", q: location },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};

export const fetchForecastData = async (location) => {
  try {
    const response = await axios.get("/api/openweather", {
      params: { type: "forecast", q: location, cnt: 40 },
    });
    // ...existing processing if needed...
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast data:", error);
    throw error;
  }
};

export const fetchWeatherDataByCoords = async (lat, lon) => {
  try {
    const response = await axios.get("/api/openweather", {
      params: { type: "weather", lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    throw error;
  }
};

export const fetchForecastDataByCoords = async (lat, lon) => {
  try {
    const response = await axios.get("/api/openweather", {
      params: { type: "forecast", lat, lon },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast data by coordinates:", error);
    throw error;
  }
};

export const fetchWeatherDataByDate = async (location, date) => {
  try {
    const today = new Date().toISOString().split("T")[0];
    if (date === today) {
      return fetchWeatherData(location);
    }
    const response = await axios.get("/api/openweather", {
      params: { type: "forecast", q: location },
    });
    const forecastList = response.data.list;
    const weatherData = forecastList.find(
      (item) => item.dt_txt.split(" ")[0] === date
    );
    if (!weatherData) {
      throw new Error("No weather data found for the selected date");
    }
    weatherData.name = response.data.city.name;
    weatherData.timezone = response.data.city.timezone;
    weatherData.city = response.data.city;
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather data by date:", error);
    throw error;
  }
};
