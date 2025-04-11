import { PatientData, Patient } from '../types';
import patientsEntries from '../../data/patientEntries';

const formatPatient = ({
  id,
  name,
  dateOfBirth,
  gender,
  occupation,
}: Patient): PatientData => ({ id, name, dateOfBirth, gender, occupation });
const formatPatients = (patients: Patient[]): PatientData[] =>
  patients.map((p) => formatPatient(p));

const getEntries = (): Patient[] => patientsEntries;
const getSecureEntries = () => formatPatients(getEntries());

export default { getEntries, getSecureEntries };
