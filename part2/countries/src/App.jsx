import countriesServices from "./services/countriesServices.js";
import {useState, useEffect} from "react";
import CountryMatch from "./components/CountryMatch.jsx";

function App() {

    const [typeValue, setTypeValue] = useState('');
    const [countries, setCountries] = useState([]);
    const [filteredCountries, setFilteredCountries] = useState([]);
    const [visibleCountries, setVisibleCountries] = useState([]);

    useEffect(() => {
        if (!countries || countries.length === 0)
        {
            countriesServices.getAllCountries().then(result =>
            {
                setCountries(result);
                if (result && result.length > 0)
                {
                    updateFilteredCountries(result);
                }
        }
        )}
        else if (countries && countries.length > 0)
        {
            updateFilteredCountries(countries);
        }
    }, [typeValue]);

    const setVisible = (index) => {
        if (visibleCountries && visibleCountries.length >= index-1)
        {
            setVisibleCountries(visibleCountries.map((country, i) => i === index ? !country:country))
        }
    }

    const updateFilteredCountries = (countries) => {
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
export default App 
