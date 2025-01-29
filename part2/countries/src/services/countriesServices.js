import axios from 'axios'
const url = 'https://studies.cs.helsinki.fi/restcountries/api/';

const getCountryByName = (filter) => axios.get(`/name/${url}name/${filter}`).then(result => result.data);const getAllCountries = () => axios.get(`${url}all/`).then(result => result.data);

export default {getAllCountries, getCountryByName};