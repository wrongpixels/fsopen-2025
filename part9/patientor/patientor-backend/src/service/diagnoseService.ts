import diagnosisEntries from '../../data/diagnosisEntries';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => diagnosisEntries;

const getEntryByCode = (code: string): Diagnosis | undefined =>
  diagnosisEntries.find((d) => d.code === code);

const addDiagnosis = (diagnosis: Diagnosis): Diagnosis => {
  //diagnosisEntries = diagnosisEntries.concat(diagnosis)
  return diagnosis;
};

export default { getEntries, getEntryByCode, addDiagnosis };
