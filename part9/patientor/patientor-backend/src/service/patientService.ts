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
}: Patient): PatientData => ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
});

const getEntries = (): Patient[] => patientEntries;
const getSecureEntries = () => patientEntries.map((p) => formatPatient(p));

const addPatient = (newPatient: NewPatient): Patient => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const id: string = uuid();
  const actualPatient: Patient = toPatient(newPatient, id);
  return actualPatient;
};

const getPatientById = (id: string): Patient | undefined =>
  getEntries().find((p) => p.id === id);

export default { getEntries, getSecureEntries, addPatient, getPatientById };
