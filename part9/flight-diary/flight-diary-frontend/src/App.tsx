import { useState, useEffect } from 'react';
import { getAllDiaries, addDiary } from './services/diaryService';
import { DiaryEntry, NewDiaryEntry } from './types';
import NewEntryForm from './components/NewEntryForm';
import DiaryEntries from './components/DiaryEntries';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>();

  const createDiary = async (diaryEntry: NewDiaryEntry) => {
    const addedDiary: DiaryEntry = await addDiary(diaryEntry);
    setDiaries(diaries?.concat(addedDiary));
  };

  const getDiaries = async () => {
    const _diaries = await getAllDiaries();
    setDiaries(_diaries);
  };

  useEffect(() => {
    getDiaries();
  }, []);

  if (!diaries) {
    return <>Loading...</>;
  }
  return (
    <>
      <NewEntryForm createDiary={createDiary} />
      <DiaryEntries diaries={diaries} />
    </>
  );
};
export default App;
