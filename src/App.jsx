import { useState, useEffect } from "react";
import Search from "./components/Search";
import headerLogo from "./assets/images/headerLogo.svg";
import ThisDayInfo from "./sections/ThisDayInfo";
import ThisDay from "./sections/ThisDay";
import WeatherCards from "./sections/WeatherCards";
import {
  fetchWeatherDataByCoords,
  fetchForecastData,
  fetchWeatherDataByDate,
  fetchWeatherData,
} from "./services/weatherService";

const App = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [city, setCity] = useState(null);

  useEffect(() => {
    if (weatherData) {
      setCity(weatherData.name);

      // Fetch both forecast data and current weather when city changes
      Promise.all([
        fetchForecastData(weatherData.name),
        fetchWeatherData(weatherData.name),
      ]).then(([forecast, current]) => {
        // Merge current weather into forecast if needed
        if (forecast && forecast.list && forecast.list.length > 0) {
          // Add current date info to forecast for today's card
          const today = new Date().toISOString().split("T")[0];

          // Check if today is already in the forecast
          const hasTodayForecast = forecast.list.some(
            (item) => item.dt_txt.split(" ")[0] === today
          );

          // If today is not in forecast, add current weather as first item
          if (!hasTodayForecast) {
            // Format current weather to match forecast format
            const currentAsForecst = {
              ...current,
              dt_txt: `${today} ${new Date().getHours()}:00:00`,
              main: current.main,
              weather: current.weather,
            };

            // Add current weather to beginning of forecast list
            forecast.list.unshift(currentAsForecst);
          }
        }

        setForecastData(forecast);
      });
    }
  }, [weatherData]);

  useEffect(() => {
    if (selectedDate && city) {
      // Get today's date string to compare
      const today = new Date().toISOString().split("T")[0];

      // Check if the selected date is today
      if (selectedDate === today) {
        // If today is selected, fetch fresh current weather data
        fetchWeatherData(city)
          .then((data) => {
            setWeatherData(data);
          })
          .catch((error) => {
            console.error("Error fetching today's weather:", error);
          });
      } else {
        // For other days, use forecast data as before
        fetchWeatherDataByDate(city, selectedDate).then((data) => {
          setWeatherData((prevData) => ({
            ...prevData,
            main: data.main,
            weather: data.weather,
            wind: data.wind,
            rain: data.rain,
            snow: data.snow,
            dt_txt: data.dt_txt,
          }));
        });
      }
    }
  }, [selectedDate, city]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherDataByCoords(latitude, longitude).then(setWeatherData);
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto my-0 max-lg:px-4 px-22 font-montserrat">
        <header className="header pt-5">
          <div className="flex items-center justify-between gap-5 max-[450px]:flex-col max-[450px]:items-center">
            <div className="flex items-center gap-5">
              <img
                src={headerLogo}
                alt="React Weather"
                width={65}
                height={65}
              />
              <a
                href="/"
                className="font-bold text-primary text-2xl uppercase max-sm:text-xl"
              >
                React Weather
              </a>
            </div>
            <nav className="max-[450px]:mt-3 max-[450px]:w-full max-[450px]:flex max-[450px]:justify-center">
              <Search
                setWeatherData={(data) => {
                  setWeatherData(data);
                  setCity(data.name);
                }}
              />
            </nav>
          </div>
        </header>
        <main className="mt-8">
          <div className="flex items-center justify-between gap-12 pb-12.5 max-sm:gap-5 max-[560px]:flex-col max-[560px]:items-center">
            <ThisDay weatherData={weatherData} />
            <ThisDayInfo weatherData={weatherData} />
          </div>
          <div className="flex flex-col text-center pb-10 2xl:justify-center 2xl:items-center">
            <WeatherCards
              forecastData={forecastData}
              onSelectDate={setSelectedDate}
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
