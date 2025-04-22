import axios from 'axios';
import { DiaryEntry, NewDiaryEntry } from '../types';
const URL = 'http://localhost:3000/api/diaries';

export const getAllDiaries = async () => {
  const data = await axios.get<DiaryEntry[]>(URL);
  console.log(data.data);
  return data.data;
};

export const addDiary = async (diary: NewDiaryEntry) => {
  const addedDiary: DiaryEntry = (await axios.post(URL, diary)).data;
  return addedDiary;
};
