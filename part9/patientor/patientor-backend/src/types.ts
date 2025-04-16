import z from 'zod';
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Entry {}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}
export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}
export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export type PatientData = Omit<Patient, 'ssn' | 'entries'>;
export type NewPatient = z.infer<typeof NewPatientSchema>;
