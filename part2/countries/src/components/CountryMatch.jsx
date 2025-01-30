import CountryEntry from "./CountryEntry.jsx";

const buttonStyle = {
    marginLeft: 7
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
                        style={buttonStyle} onClick={() => setVisible(index)}>{visibility[index]?'Hide':'Show'}</button> {visibility[index] && <CountryEntry country={country} />}
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
export default CountryMatch;