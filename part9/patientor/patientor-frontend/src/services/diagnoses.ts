import axios from 'axios';
import { apiBaseUrl } from '../constants';
import { Diagnosis } from '../types';

const getAll = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data;
};

const getAllCodes = async () => {
  const { data } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return data.map((d) => d.code);
};

const getByCode = async (code: string) => {
  const { data } = await axios.get<Diagnosis>(
    `${apiBaseUrl}/diagnoses/${code}`
  );
  return data;
};

const getNameByCode = async (code: string) => (await getByCode(code)).name;

export default { getByCode, getNameByCode, getAll, getAllCodes };
