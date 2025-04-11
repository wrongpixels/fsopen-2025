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

export type PatientData = Omit<Patient, 'ssn'>;

type Gender = 'male' | 'female' | 'other';
