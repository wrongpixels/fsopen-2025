import diagnosesEntries from '../../data/diagnosesEntries';
import { Diagnosis } from '../types';

const getEntries = (): Diagnosis[] => diagnosesEntries;

export default { getEntries };
