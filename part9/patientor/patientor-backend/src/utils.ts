import { Gender, NewPatient } from './types';

const fields: string[] = ['name', 'dateOfBirth', 'gender', 'occupation', 'ssn'];

const verifyPatientObject = (
  object: unknown
): object is {
  name: unknown;
  dateOfBirth: unknown;
  gender: unknown;
  occupation: unknown;
  ssn: unknown;
} => {
  if (!object || typeof object !== 'object') {
    return false;
  }
  for (const f of fields) {
    if (!(f in object)) {
      return false;
    }
  }
  return true;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!verifyPatientObject(object)) {
    console.log(object);
    throw new Error('Missing or wrong Patient Data');
  }
  const patient: NewPatient = {
    name: parseString(object.name, 'name'),
    ssn: parseString(object.ssn, 'ssn'),
    occupation: parseString(object.occupation, 'occupation'),
    gender: parseGender(object.gender),
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
  };
  return patient;
};

const isString = (string: unknown): string is string =>
  typeof string === 'string' || string instanceof String;

const parseString = (string: unknown, fieldName: string = ''): string => {
  if (!isString(string)) {
    throw new Error(
      `Incorrect or missing ${fieldName ? fieldName + ' ' : ''}field: ${string}`
    );
  }
  return string;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error(`Incorrect or missing gender field: ${gender}`);
  }
  return gender;
};

const isGender = (gender: string): gender is Gender =>
  Boolean(Object.values(Gender).includes(gender as Gender));

const parseDateOfBirth = (dateOB: unknown): string => {
  if (!isString(dateOB) || !Date.parse(dateOB)) {
    throw new Error(`Incorrect or missing date of birthday field: ${dateOB}`);
  }
  return dateOB;
};
