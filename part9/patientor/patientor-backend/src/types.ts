import z from 'zod';

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

export type PatientData = Omit<Patient, 'ssn'>;
export type NewPatient = z.infer<typeof NewPatientSchema>;
