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
  const [isCitySelected, setIsCitySelected] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1024);

  // Track changes in screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (weatherData) {
      setCity(weatherData.name);
      setIsCitySelected(true); // The user has selected a city

      Promise.all([
        fetchForecastData(weatherData.name),
        fetchWeatherData(weatherData.name),
      ]).then(([forecast, current]) => {
        if (forecast && forecast.list && forecast.list.length > 0) {
          const today = new Date().toISOString().split("T")[0];
          const hasTodayForecast = forecast.list.some(
            (item) => item.dt_txt.split(" ")[0] === today
          );
          if (!hasTodayForecast) {
            const currentAsForecast = {
              ...current,
              dt_txt: `${today} ${new Date().getHours()}:00:00`,
              main: current.main,
              weather: current.weather,
            };
            forecast.list.unshift(currentAsForecast);
          }
        }
        setForecastData(forecast);
      });
    }
  }, [weatherData]);

  useEffect(() => {
    if (selectedDate && city) {
      const today = new Date().toISOString().split("T")[0];
      if (selectedDate === today) {
        fetchWeatherData(city)
          .then((data) => setWeatherData(data))
          .catch((error) =>
            console.error("Error fetching today's weather:", error)
          );
      } else {
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
          fetchWeatherDataByCoords(latitude, longitude)
            .then((data) => {
              setWeatherData(data);
              setIsCitySelected(true); // Geolocation has worked, show sections
            })
            .catch(() => setIsCitySelected(false)); // If error - hide sections
        },
        () => setIsCitySelected(false) // If the user has forbidden geolocation - hide it
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
                  setIsCitySelected(true);
                }}
              />
            </nav>
          </div>
        </header>
        <main className="mt-8">
          {!isCitySelected && (
            <p className="text-center font-bold text-xl pt-5 max-[450px]:text-lg">
              Enter the name of the city to see the weather.
            </p>
          )}
          <div
            className={`flex items-center justify-between gap-12 pb-12.5 max-sm:gap-5 max-[560px]:flex-col max-[560px]:items-center ${
              !isCitySelected || (isMobile && !isCitySelected) ? "hidden" : ""
            }`}
          >
            <ThisDay weatherData={weatherData} />
            <ThisDayInfo weatherData={weatherData} />
          </div>
          <div
            className={`flex flex-col text-center pb-10 2xl:justify-center 2xl:items-center ${
              !isCitySelected || (isMobile && !isCitySelected) ? "hidden" : ""
            }`}
          >
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
