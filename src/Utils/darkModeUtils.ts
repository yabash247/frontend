import { Dispatch } from "@reduxjs/toolkit";
import { setDarkMode } from "../ReduxToolkit/Reducers/darkModeSlice";

export const fetchWeatherAndSetDarkMode = async (dispatch: Dispatch<any>, autoSwitch: boolean) => {
  if (!autoSwitch) return;

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=YOUR_API_KEY&q=your_location`
    );
    const data = await response.json();

    const currentTime = new Date().getTime();
    const sunrise = new Date(`1970-01-01T${data.forecast.forecastday[0].astro.sunrise}`).getTime();
    const sunset = new Date(`1970-01-01T${data.forecast.forecastday[0].astro.sunset}`).getTime();

    const isDarkMode = currentTime < sunrise || currentTime > sunset;
    dispatch(setDarkMode(isDarkMode));
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
};
