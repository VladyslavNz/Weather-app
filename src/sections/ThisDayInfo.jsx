import cloud from "../assets/images/cloud.png";
import temp from "../assets/icons/temp.svg";
import pressure from "../assets/icons/pressure.svg";
import precipitation from "../assets/icons/precipitation.svg";
import wind from "../assets/icons/wind.svg";
import { UNITS } from "../constants/units";

const ThisDayInfo = ({ weatherData }) => {
  // Extract precipitation data from weather data
  const precipitationData =
    weatherData?.rain?.["1h"] || weatherData?.snow?.["1h"] || 0;

  // Determine if precipitation is actually forecasted
  const hasPrecipitation = precipitationData > 0;

  return (
    <div className="shadow-primary rounded-2xl flex w-[750px] h-[300px] relative items-center z-1  max-[560px]:w-[100%] max-[560px]:h-[auto] max-[560px]:flex-col max-[560px]:gap-5 max-[560px]:px-5">
      <div className="flex flex-col gap-5 text-sm max-md:gap-10 max-md:text-[16px] ml-8 max-md:ml-5 max-[560px]:py-5">
        {/* Temperature section */}
        <div className="flex items-center gap-5">
          <div className="w-9 h-9 rounded-full shadow-primary flex items-center justify-center max-md:hidden">
            <img
              src={temp}
              width={25}
              alt="Temperature"
              className="max-md:hidden block"
            />
          </div>
          <span className="text-description pr-1 max-md:pr-0">Temperature</span>
          <p>
            {weatherData
              ? `${Math.round(weatherData.main.temp)}${
                  UNITS.TEMP_UNIT
                } - feels like ${Math.round(weatherData.main.feels_like)}${
                  UNITS.TEMP_UNIT
                }`
              : "--"}
          </p>
        </div>

        {/* Pressure section */}
        <div className="flex items-center gap-5">
          <div className="w-9 h-9 rounded-full shadow-primary flex items-center justify-center max-md:hidden">
            <img
              src={pressure}
              width={19}
              alt="Pressure"
              className="max-md:hidden block"
            />
          </div>
          <span className="text-description pr-8">Pressure</span>
          <p>
            {weatherData
              ? `${weatherData.main.pressure} ${UNITS.PRESSURE_UNIT}`
              : "--"}
          </p>
        </div>

        {/* Precipitation section */}
        <div className="flex items-center gap-5">
          <div className="w-9 h-9 rounded-full shadow-primary flex items-center justify-center max-md:hidden">
            <img
              src={precipitation}
              width={18}
              alt="Precipitation"
              className="max-md:hidden block"
            />
          </div>
          <span className="text-description pr-1 max-md:pr-0 ">
            Precipitation
          </span>
          <p>
            {!weatherData
              ? "--"
              : hasPrecipitation
              ? `${precipitationData} ${UNITS.PRECIPITATION_UNIT}`
              : "No precipitation"}
          </p>
        </div>

        {/* Wind section */}
        <div className="flex items-center gap-5">
          <div className="w-9 h-9 rounded-full shadow-primary flex items-center justify-center max-md:hidden">
            <img
              src={wind}
              width={20}
              alt="Wind"
              className="max-md:hidden block"
            />
          </div>
          <span className="text-description pr-14">Wind</span>
          <p>
            {weatherData
              ? `${Math.round(
                  weatherData.wind.speed * UNITS.WIND_MS_TO_KMH
                )} km/h`
              : "--"}
          </p>
        </div>
        <img
          src={cloud}
          className="absolute top-0 right-0 -z-1 hidden xl:block"
          alt="Cloud"
        />
      </div>
    </div>
  );
};

export default ThisDayInfo;
