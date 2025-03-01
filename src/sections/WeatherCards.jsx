import React, { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";

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

const WeatherCards = ({ forecastData, onSelectDate }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Update isMobile state when window is resized
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Group forecast data by day, taking the first entry of each day
  const dailyForecast = useMemo(() => {
    if (!forecastData || !forecastData.list) return [];

    // Get today's date (in local time)
    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const days = [];
    const daysMap = {};

    // Group forecasts by day
    forecastData.list.forEach((item) => {
      const date = item.dt_txt.split(" ")[0];
      if (!daysMap[date]) {
        daysMap[date] = item;
        days.push(item);
      }
    });

    // Sort by date to ensure chronological order
    days.sort((a, b) => {
      const dateA = a.dt_txt.split(" ")[0];
      const dateB = b.dt_txt.split(" ")[0];
      return new Date(dateA) - new Date(dateB);
    });

    // If today is not included in the forecast, add it using the first available forecast
    if (days.length > 0) {
      const firstDate = days[0].dt_txt.split(" ")[0];

      // Create a "today" entry if today isn't already the first day
      if (firstDate !== todayString && days[0]) {
        // Clone the first entry but mark it as today
        const todayForecast = {
          ...days[0],
          dt_txt: `${todayString} ${days[0].dt_txt.split(" ")[1]}`,
          isForced: true, // Mark this as a forced "today" entry
        };

        // Add today as the first entry
        days.unshift(todayForecast);
      }
    }

    // Only take up to 8 days
    return days.slice(0, 8);
  }, [forecastData]);

  const handleCardClick = (index, date) => {
    setSelectedIndex(index);

    // If clicking the first card (Today), make sure to use today's actual date
    if (index === 0) {
      const todayString = new Date().toISOString().split("T")[0];
      onSelectDate(todayString);
    } else {
      onSelectDate(date);
    }
  };

  const getWeatherCard = (weather, index) => {
    if (!weather) return null;

    const weatherIconClass = weatherIcons[weather.weather[0].icon];
    const date = weather.dt_txt.split(" ")[0];

    // Get the date object - if this is forced today entry, use current date
    const forecastDate = weather.isForced
      ? new Date()
      : new Date(weather.dt * 1000);

    // Get day of week
    let dayOfWeek = format(forecastDate, "EEEE");

    // If it's the first card (index 0), make sure it says "Today"
    if (index === 0) {
      dayOfWeek = "Today";
    }

    // Card content that remains the same regardless of desktop/mobile
    const cardContent = (
      <div className="p-3">
        <h3 className="text-lg font-medium pb-2">{dayOfWeek}</h3>
        <p className="text-sm text-description pb-3">
          {new Date(date).toLocaleDateString()}
        </p>
        {weatherIconClass && (
          <i className={`${weatherIconClass} text-4xl max-[560px]:mx-auto`}></i>
        )}
        <p className="text-lg font-medium pt-3">
          {`${Math.round(weather.main.temp_max)}°C`}
        </p>
        <p className="text-sm pb-1.5">
          {`${Math.round(weather.main.temp_min)}°C`}
        </p>
        <p className="text-sm">{weather.weather[0].description}</p>
      </div>
    );

    return (
      <div
        key={index}
        className={`bg-primary-light w-full md:w-[200px] max-xl:w-[150px] rounded-xl shadow-primary 
                  max-2xl:text-center ${
                    selectedIndex === index ? "border-2 border-blue-500" : ""
                  }`}
        onClick={() => handleCardClick(index, date)}
      >
        {cardContent}
      </div>
    );
  };

  // Для мобильных устройств используем простой горизонтальный скролл
  if (isMobile) {
    return (
      <div className="p-5 shadow-primary">
        <div className="flex overflow-x-auto pb-4 gap-3 snap-x">
          {dailyForecast.map((item, index) => (
            <div key={index} className="snap-center flex-shrink-0">
              {getWeatherCard(item, index)}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Для десктопа используем сетку
  return (
    <div className="flex flex-row max-lg:grid max-lg:grid-cols-3 max-lg:gap-10 max-lg:mx-auto gap-5 p-5 shadow-primary overflow-x-auto">
      {dailyForecast.map((item, index) => getWeatherCard(item, index))}
    </div>
  );
};

export default WeatherCards;
