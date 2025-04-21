import z, { string } from 'zod';
export type UnionOmit<T, K extends string | number | symbol> = T extends unknown
  ? Omit<T, K>
  : never;

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

export enum EntryType {
  Hospital = 'Hospital',
  OccupationalHealthcare = 'OccupationalHealthcare',
  HealthCheck = 'HealthCheck',
}
export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export const DiagnosisSchema = z.object({
  code: z.string(),
  name: z.string(),
  latin: z.string().optional(),
});

const ensureNever = (entry: never) => {
  throw new Error('Error' + entry);
};

export const parseNewEntry = (body: unknown): NewEntry => {
  const entry = NewyEntrySchema.parse(body);
  switch (entry.type) {
    case EntryType.Hospital:
      return HospitalEntrySchema.parse(body);
    case EntryType.HealthCheck:
      return HealthCheckEntrySchema.parse(body);
    case EntryType.OccupationalHealthcare:
      return OccupationaltEntrySchema.parse(body);
    default:
      return ensureNever(entry.type);
  }
};

const baseEntrySchema = z.object({
  description: z.string().min(1, 'Description cannot be empty'),
  date: z.string().date(),
  specialist: z.string().min(1, 'Specialist cannot be empty'),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const NewyEntrySchema = z.object({
  type: z.nativeEnum(EntryType),
});

export const HealthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.HealthCheck),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});
export const HospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.Hospital),
  discharge: z.object({
    date: z.string().date(),
    criteria: string().min(1, 'Criteria cannot be empty'),
  }),
});

export const OccupationaltEntrySchema = baseEntrySchema.extend({
  type: z.literal(EntryType.OccupationalHealthcare),
  employerName: z.string().min(1, 'Employer name cannot be empty'),
  sickLeave: z
    .object({
      startDate: string().date().optional(),
      endDate: string().date().optional(),
    })
    .optional(),
});

export type PatientData = Omit<Patient, 'ssn' | 'entries'>;
export type NewPatient = z.infer<typeof NewPatientSchema>;
export type NewEntry = z.infer<
  | typeof HealthCheckEntrySchema
  | typeof HospitalEntrySchema
  | typeof OccupationaltEntrySchema
>;
