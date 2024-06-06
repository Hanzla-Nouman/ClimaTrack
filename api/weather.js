import axios from "axios";
import { API } from "../constants/key";

const forecastEndpoint = params =>
  `https://api.weatherapi.com/v1/forecast.json?key=${API}&q=${params.city}&days=${params.days}&aqi=no`;

const locationEndpoint = params =>
  `https://api.weatherapi.com/v1/search.json?key=${API}&q=${params.city}`;

export const fetchForecastData = params => {
    console.log(params.days)
  return axios.get(forecastEndpoint(params))
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching forecast data:", error);
      throw error;
    });
};

export const fetchLocationData = params => {
  return axios.get(locationEndpoint(params))
    .then(response => response.data)
    .catch(error => {
      console.error("Error fetching location data:", error);
      throw error;
    });
};
