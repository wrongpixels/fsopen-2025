import { useState, useEffect } from 'react';
import { getAllDiaries } from './services/diaryService';
import { DiaryEntry } from './types';

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>();
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
          <li key={d.id}>
            <h3>{d.date}</h3>
            <b>Visibility: </b>
            {d.visibility}
            <div>
              <b>Weather: </b>
              {d.weather}
            </div>
            {d.comment && (
              <div>
                <b>Comment: </b>
                {d.comment}
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};
export default App;
