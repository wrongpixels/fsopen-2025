import { useState, useEffect } from 'react';
import { getAllDiaries } from './services/diaryService';
import { DiaryEntry } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [newDiary, setNewDiary] = useState<DiaryEntry>();

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
      <h1>Diaries</h1>
      <ul>
        {diaries.map((d) => (
          <li key={d.id}>{d.date}</li>
        ))}
      </ul>
    </>
  );
};
export default App;
