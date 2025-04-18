import { PatientData, Patient, NewPatient, NewEntry, Entry } from '../types';
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
  const id: string = uuid();
  const actualPatient: Patient = toPatient(newPatient, id);
  return actualPatient;
};

const addPatientEntry = (newEntry: NewEntry, patientId: string): Entry => {
  const patient = getPatientById(patientId);
  if (!patient) {
    throw new Error('Patient id does not exist');
  }
  const id: string = uuid();
  const entry: Entry = { ...newEntry, id };
  patient.entries = patient.entries.concat(entry);
  return entry;
};

const getPatientById = (id: string): Patient | undefined =>
  getEntries().find((p) => p.id === id);

export default {
  getEntries,
  getSecureEntries,
  addPatient,
  getPatientById,
  addPatientEntry,
};
