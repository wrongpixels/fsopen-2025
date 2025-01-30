import axios from 'axios'

const weatherAPI = import.meta.env.VITE_WEATHER_API;
const url = 'https://studies.cs.helsinki.fi/restcountries/api/';
const weatherURL = (lat, lon) => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherAPI}&units=metric`;
const getWeatherIconURL = (id) => `https://openweathermap.org/img/wn/${id}@2x.png`
const getAllCountries = () => axios.get(`${url}all/`).then(result => result.data);
const getCityWeather = (latlng) => axios.get(weatherURL(latlng[0], latlng[1])).then(result => result.data);

export default {getAllCountries, getCityWeather, getWeatherIconURL};