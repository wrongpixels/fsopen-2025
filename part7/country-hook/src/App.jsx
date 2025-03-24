import React, { useState, useEffect } from "react";
import axios from "axios";

const useField = (type) => {
  const [value, setValue] = useState("");

  const onChange = (event) => {
    setValue(event.target.value);
  };
  return {
    type,
    value,
    onChange,
  };
};

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  const findCountry = async (name) => {
    const countryStructure = { data: null, found: false };
    if (!name) {
      setCountry(null);
    } else {
      try {
        const match = await axios.get(
          `https://studies.cs.helsinki.fi/restcountries/api/name/${name}`,
        );
        countryStructure.data = {
          name: match.data.name.common,
          population: match.data.population,
          capital: match.data.capital[0],
          flag: match.data.flags.png,
        };
        countryStructure.found = true;
        setCountry(countryStructure);
      } catch (e) {
        countryStructure.found = false;
      }
      setCountry(countryStructure);
    }
  };

  useEffect(() => {
    findCountry(name);
  }, [name]);

  return country;
};

const Country = ({ country }) => {
  const message = !country
    ? "please insert a country name"
    : !country.data
      ? "not found..."
      : "";
  if (message) {
    return <div>{message}</div>;
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div>
      <img
        src={country.data.flag}
        height="100"
        alt={`flag of ${country.data.name}`}
      />
    </div>
  );
};

const App = () => {
  const nameInput = useField("text");
  const [name, setName] = useState("");
  const country = useCountry(name);

  const fetch = async (e) => {
    e.preventDefault();
    setName(nameInput.value);
  };

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  );
};

export default App;
