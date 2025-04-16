import axios from 'axios';
import { DiaryEntry } from '../types';
const URL = 'http://localhost:3000/api/diaries';

export const getAllDiaries = async () => {
  const data = await axios.get<DiaryEntry[]>(URL);
  console.log(data.data);
  return data.data;
};
