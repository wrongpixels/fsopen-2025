import { NewPatient, Patient } from './types';
import { NewPatientSchema } from './types';

export const toNewPatient = (object: unknown): NewPatient =>
  NewPatientSchema.parse(object);

export const toPatient = (newPatient: NewPatient, id: string): Patient => ({
  ...newPatient,
  id,
});
