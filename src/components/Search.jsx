import React, { useState } from "react";
import { fetchWeatherData } from "../services/weatherService";

const Search = ({ setWeatherData }) => {
  const [location, setLocation] = useState("");

  const searchLocation = async (event) => {
    if (event.key === "Enter") {
      try {
        const data = await fetchWeatherData(location);
        setWeatherData(data);
        console.log(data);
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLocation("");
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-primary-light rounded-[10px]">
      <input
        className="px-2 py-2 text-left text-black outline-none placeholder:text-center placeholder:text-black placeholder:font-medium focus:placeholder-transparent dark:text-white dark:placeholder:text-white"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
        onKeyDown={searchLocation}
        placeholder="Search location"
        type="text"
      />
    </div>
  );
};

export default Search;
