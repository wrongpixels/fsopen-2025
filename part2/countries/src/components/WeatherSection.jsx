import {useEffect, useState} from "react";
import countriesServices from "../services/countriesServices.js";

const WeatherSection = ({country}) => {

    const [weatherData, setWeatherData] = useState(null);
    useEffect(() => {
        countriesServices.getCityWeather(country.latlng).then(result => setWeatherData(result));
    }, []);
    if (!weatherData)
    {
        return;
    }
    const iconURL = countriesServices.getWeatherIconURL(weatherData.weather[0].icon);
    return (
        <div>
            <h2>Weather in {country.capital[0]}</h2>
            <p>
                <b>Temperature: </b>{weatherData.main.temp}ºC
            </p>
            <img src={iconURL} alt={weatherData.weather[0].main}/>
            <p>
                <b>Wind: </b>{weatherData.wind.speed}m/s
            </p>
        </div>
    )
}
export default WeatherSection;