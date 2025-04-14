import { PatientData, Patient } from '../types';
import patientEntries from '../../data/patientEntries';
import { toNewPatient } from '../utils';
import { v1 as uuid } from 'uuid';

const formatPatient = ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
}: Patient): PatientData => ({ id, name, dateOfBirth, gender, occupation });

const getEntries = (): Patient[] => patientEntries;
const getSecureEntries = () => patientEntries.map((p) => formatPatient(p));
const addPatient = (object: unknown): Patient => {
  const newPatient: Patient = toNewPatient(object) as Patient;
  newPatient.id = uuid();
  patientEntries.push(newPatient);
  return newPatient;
};

export default { getEntries, getSecureEntries, addPatient };
