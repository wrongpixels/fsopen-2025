import { NewPatient, Patient, Entry } from './types';
import { NewPatientSchema } from './types';

export const toNewPatient = (object: unknown): NewPatient =>
  NewPatientSchema.parse(object);

export const toPatient = (
  newPatient: NewPatient,
  id: string,
  entries: Entry[] = []
): Patient => ({
  ...newPatient,
  id,
  entries,
});
