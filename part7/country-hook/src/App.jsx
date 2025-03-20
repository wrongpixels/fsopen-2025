import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}


const useCountry = () => {
  const [country, setCountry] = useState(null)
  const countryStructure = { data: null}
  let found = false

  const findCountry = async (name) => {
    console.log('looking for', name)
    if (!name) {
      setCountry(null)
      return null
    }
    else {
      const match = await axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${name}`)
      if (match.data)
      {
        countryStructure.data = {
          name: match.data.name.common,
          population: match.data.population,
          capital: match.data.capital[0],
          flag: match.data.flags.png
        }
        found = true
        console.log('found ', name, found)
        setCountry(countryStructure)
      }
    }
  }
  return { country, findCountry, found: country?.data !== null }
}

const Country = ({ country }) => {
  if (!country)
  {
    return null
  }

  if (!country.data) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  if (!nameInput)
  {
    return null
  }
  const { country, findCountry } = useCountry()

  const fetch = async (e) => {
    e.preventDefault()
    await findCountry(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App