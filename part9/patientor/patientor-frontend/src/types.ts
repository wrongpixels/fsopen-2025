import { InputField } from './hooks';

export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

export interface Notification {
  message: string;
  isError: boolean;
}

export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export interface DefaultFields {
  dateField: InputField;
  descField: InputField;
  specialistField: InputField;
  drawForm: () => JSX.Element;
  cleanAll: () => void;
  baseEntryData: {
    description: string;
    date: string;
    specialist: string;
    diagnosisCodes?: string[];
  };
}

export interface EntryProps {
  addEntry: (entry: EntryFormValues) => Promise<void>;
  defaultFields: DefaultFields;
}

export type Entry =
  | HealthCheckEntry
  | HospitalEntry
  | OccupationalHealthcareEntry;

export enum HealthCheckRating {
  'Healthy' = 0,
  'LowRisk' = 1,
  'HighRisk' = 2,
  'CriticalRisk' = 3,
}

export interface Discharge {
  date: string;
  criteria: string;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}
export enum EntryType {
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare',
  HealthCheck = 'HealthCheck',
}

export interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}
export interface HealthCheckEntry extends BaseEntry {
  healthCheckRating: HealthCheckRating;
  type: EntryType.HealthCheck;
}

export interface OccupationalHealthcareEntry extends BaseEntry {
  employerName: string;
  type: EntryType.OccupationalHealthcare;
  sickLeave?: SickLeave;
}

export interface HospitalEntry extends BaseEntry {
  type: EntryType.Hospital;
  discharge: Discharge;
}
export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export type PatientFormValues = Omit<Patient, 'id' | 'entries'>;
export type EntryFormValues = UnionOmit<Entry, 'id'>;
