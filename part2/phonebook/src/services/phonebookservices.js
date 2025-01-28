import axios from "axios";

const baseURL = 'http://localhost:3001/persons/';
const getContacts = () => axios.get(baseURL).then(result => result.data);
const addNumber = (person) => axios.post(baseURL, person).then(result => result.data);
const deleteNumber = (id) => axios.delete(baseURL + id);

export default {getContacts, addNumber, deleteNumber};