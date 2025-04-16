import { useTextField } from '../hooks';
import { AxiosError } from 'axios';
import { NewDiaryEntry } from '../types';

interface NewEntryFormProps {
  createDiary: Function;
}

const NewEntryForm = (props: NewEntryFormProps) => {
  const dateField = useTextField('date', 'date');
  const visField = useTextField('visibility');
  const weatherField = useTextField('weather');
  const commentField = useTextField('comment');

  const handleNewEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      const newEntry: NewDiaryEntry = {
        date: dateField.value,
        weather: weatherField.value,
        visibility: visField.value,
        comment: commentField.value,
      };
      await props.createDiary(newEntry);
      dateField.clean();
      visField.clean();
      weatherField.clean();
      commentField.clean();
    } catch (error) {
      console.log(
        error instanceof AxiosError
          ? error.response?.data
          : 'Error adding Diary'
      );
    }
  };

  return (
    <>
      <h1>Add new entry</h1>
      <form onSubmit={handleNewEntry}>
        <div>Date: {dateField.field}</div>
        <div>Visibility: {visField.field}</div>
        <div>Weather: {weatherField.field}</div>
        <div>Comment: {commentField.field}</div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
    </>
  );
};

export default NewEntryForm;
