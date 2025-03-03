import React, { useState, useEffect } from "react";
import { format, isValid, addSeconds } from "date-fns";

const weatherIcons = {
  "01d": "wi wi-day-sunny",
  "01n": "wi wi-night-clear",
  "02d": "wi wi-day-cloudy",
  "02n": "wi wi-night-alt-cloudy",
  "03d": "wi wi-cloud",
  "03n": "wi wi-cloud",
  "04d": "wi wi-cloudy",
  "04n": "wi wi-cloudy",
  "09d": "wi wi-showers",
  "09n": "wi wi-showers",
  "10d": "wi wi-day-rain",
  "10n": "wi wi-night-alt-rain",
  "11d": "wi wi-thunderstorm",
  "11n": "wi wi-thunderstorm",
  "13d": "wi wi-snow",
  "13n": "wi wi-snow",
  "50d": "wi wi-fog",
  "50n": "wi wi-fog",
};

const ThisDay = ({ weatherData }) => {
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(timer); 
  }, []);

  // Check if weather data is available
  if (!weatherData || !weatherData.weather || !weatherData.main) {
    return <div>Loading weather data...</div>;
  }

  const weatherIconClass = weatherIcons[weatherData.weather[0].icon];

  // Handle both current weather data and forecast data
  const weatherDate = weatherData.dt_txt
    ? new Date(weatherData.dt_txt)
    : new Date(weatherData.dt * 1000); // For current weather, dt is in seconds

  // Get timezone offset
  const timeZoneOffset = weatherData.city
    ? weatherData.city.timezone
    : weatherData.timezone || 0;

  const localDate = addSeconds(weatherDate, timeZoneOffset);

  // Determine if the date is today
  const today = new Date();
  const isToday =
    localDate.getDate() === today.getDate() &&
    localDate.getMonth() === today.getMonth() &&
    localDate.getFullYear() === today.getFullYear();

  const dayOfWeek = format(localDate, "EEEE");

  return (
    <div className="flex flex-col border-white rounded-2xl shadow-primary px-5 h-[300px]">
      <div className="flex flex-col justify-between gap-6 max-[560px]:px-5">
        <div className="flex items-center justify-between gap-[67px] max-md:gap-10">
          <div className="flex flex-col">
            <h1 className="font-medium text-8xl max-xl:text-6xl max-xl:mt-10 text-primary">
              {`${Math.round(weatherData.main.temp)}°C`}
            </h1>
            <h2 className="text-[40px] max-md:text-3xl max-md:mt-2">
              {isToday ? "Today" : dayOfWeek}
            </h2>
          </div>
          {weatherIconClass && (
            <i
              className={`${weatherIconClass} text-6xl max-md:text-5xl max-md:`}
            ></i>
          )}
        </div>
        <div className="flex flex-col gap-[14px] text-2xl text-description">
          <p>
            {isToday
              ? `Time: ${currentTime}`
              : `Day: ${localDate.toLocaleDateString()}`}
          </p>
          <p>City: {weatherData.name}</p>
        </div>
      </div>
    </div>
  );
};

export default ThisDay;
