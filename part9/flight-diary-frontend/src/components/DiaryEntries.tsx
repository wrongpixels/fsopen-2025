import { DiaryEntry } from '../types';

interface DiaryEntriesProps {
  diaries: DiaryEntry[];
}

const DiaryEntries = (props: DiaryEntriesProps) => {
  return (
    <>
      <h1>Diaries</h1>
      <ul>
        {props.diaries.map((d) => (
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

export default DiaryEntries;
