import { AxiosError } from 'axios';
import { InputField } from './hooks';
import { EntryType } from './types';

export const splitCamelCase = (str: string) => {
  return str.replace(/([A-Z])/g, ' $1').trim();
};

export const assertNever = (entry: never) => {
  throw new Error(entry);
};

export const manageEntryErrors = (e: unknown): string => {
  const errorMessage =
    e instanceof AxiosError
      ? e.response?.data.error
      : e instanceof Error
      ? e.message
      : 'Error adding Entry';
  return errorMessage;
};

export const getEntryTypeFromString = (str: string): EntryType => {
  switch (str) {
    case 'Hospital':
      return EntryType.Hospital;
    case 'Health Check':
      return EntryType.HealthCheck;
    case 'Occupational Healthcare':
      return EntryType.OccupationalHealthcare;
    default:
      throw new Error(`${str} is not a valid Entry Type`);
  }
};

export const cleanFields = (fields: InputField[]) =>
  fields.forEach((f) => f.clean());

export const getStringNameFromType = (type: EntryType): string => {
  switch (type) {
    case EntryType.Hospital:
      return 'Hospital';
    case EntryType.HealthCheck:
      return 'Health Check';
    case EntryType.OccupationalHealthcare:
      return 'Occupational Healthcare';
    default:
      return assertNever(type);
  }
};
