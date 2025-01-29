import countriesServices from "./services/countriesServices.js";
import {useState, useEffect} from "react";

function App() {

    const [typeValue, setTypeValue] = useState('');
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [visibleCountries, setVisibleCountries] = useState([]);

    useEffect(() => {
            countriesServices.getAllCountries().then(result => {
                setCountries(result);
            })
    }, []);
    useEffect(() => {
        updateFilteredCountries();
    }, [typeValue]);

    const setVisible = (index) => {
        if (visibleCountries && visibleCountries.length >= index-1)
        {
            setVisibleCountries(visibleCountries.map((country, i) => i === index ? !country:country))
        }
    }

    const updateFilteredCountries = () => {
        const filtered = typeValue?countries.filter(country => country.name.common.toLowerCase().includes(typeValue.toLowerCase())):[];
        setFilteredCountries(filtered);
        setVisibleCountries(new Array (filtered.length).fill(false))

    }
    const handleTypeCountry = (event) => {
        setTypeValue(event.target.value);
    }
    return (
        <div>
            Find countries: <input value={typeValue} onChange={handleTypeCountry}/>
            <CountryMatch countries={filteredCountries} visibility={visibleCountries} setVisible={setVisible}/>
        </div>
    )
}
const CountryMatch = ({countries, visibility, setVisible}) => {
    if (countries.length === 1)
    {
        return (
           <CountryEntry country={countries[0]} />
        )
    }
    if (countries.length <= 10)
    {
        return (
                <ul>
                    {countries.map((country, index) =>
                        <li key={country.cca2}><b>{country.name.common}</b><button
                            onClick={() => setVisible(index)}>{visibility[index]?'Hide':'Show'}</button> {visibility[index] && <CountryEntry country={country} />}
                        </li>)}

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
