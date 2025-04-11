import diagnosisEntries from '../../data/diagnosisEntries';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => diagnosisEntries;

export default { getEntries };
