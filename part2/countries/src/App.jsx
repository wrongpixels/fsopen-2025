import countriesServices from "./services/countriesServices.js";
import {useState, useEffect} from "react";

function App() {

    const [typeValue, setTypeValue] = useState('');
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([])

    useEffect(() => {
            countriesServices.getAllCountries().then(result => {
                setCountries(result);
            })
    }, []);
    useEffect(() => {
        updateFilteredCountries();
    }, [typeValue]);

    const updateFilteredCountries = () => {
        setFilteredCountries(typeValue?countries.filter(country => country.name.common.toLowerCase().includes(typeValue.toLowerCase())):[]);
    }
    const handleTypeCountry = (event) => {
        setTypeValue(event.target.value);
    }
    return (
        <div>
            Find countries: <input value={typeValue} onChange={handleTypeCountry}/>
            <CountryMatch countries={filteredCountries} />
        </div>
    )
}
const CountryMatch = ({countries}) => {
    if (countries.length === 1)
    {
        const country = countries[0];
        return (
           <CountryEntry country={country} />
        )
    }
    if (countries.length <= 10)
    {
        return (
                <ul>
                    {countries.map(country => <li key={country.cca2}><b>{country.name.common}</b></li>)}
                </ul>
        )
    }
    return (
        <>
        <h3>Too many matches!</h3>
            Please specify another filter.
        </>
    )
}

const CountryEntry = ({country}) =>
{
    return (
        <>
        <h1>
            {country.name.common}
        </h1>
            <b>Capital:</b> {country.capital}<br/>
            <b>Area: </b> {country.area}
            <h2>Languages</h2>
            <ObjectList list={country.languages} />
            <DrawFlag country={country} />
        </>
    )
}

const ObjectList = ({list}) => {
    const listValues = Object.values(list);
    return (
        <ul>
            {listValues.map(element => <li key={element}>{element}</li>)}
        </ul>
    )
}
const DrawFlag = ({country}) => {
    return (
        <img src={country.flags.png} alt={country.flags.alt}/>
    )
}
export default App 
