import { PatientData, Patient, NewPatient } from '../types';
import patientEntries from '../../data/patientEntries';
import { toPatient } from '../utils';
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

const addPatient = (newPatient: NewPatient): Patient => {
  const actualPatient: Patient = toPatient(newPatient, uuid());
  return actualPatient;
};

export default { getEntries, getSecureEntries, addPatient };
