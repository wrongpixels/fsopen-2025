import DrawFlag from "./DrawFlag.jsx";
import WeatherSection from "./WeatherSection.jsx";
import ObjectList from "./ObjectList.jsx";
const CountryEntry = ({country}) =>
{
    return (
        <>
            <h1>
                {country.name.common}
            </h1>
            <b>{country.capital.length === 1?'Capital':'Capitals'}:</b> {country.capital.join(', ')}<br/>
            <b>Area: </b> {country.area}
            <h2>Languages</h2>
            <ObjectList list={country.languages} />
            <DrawFlag country={country} />
            <WeatherSection country={country} />
        </>
    )
}
export default CountryEntry;