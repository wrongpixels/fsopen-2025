import { useTextField } from '../hooks';
import { AxiosError } from 'axios';
import { NewDiaryEntry } from '../types';
import Notification from './Notification';
import { useState } from 'react';

interface NewEntryFormProps {
  createDiary: Function;
}

const NewEntryForm = (props: NewEntryFormProps) => {
  const [notification, setNotification] = useState('');
  const sendNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 5000);
  };

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
      let message: string = 'Error adding Diary Entry';
      if (error instanceof AxiosError) {
        const cleanData: string = error.response?.data?.replace(
          'Something went wrong.',
          ''
        );
        message = cleanData;
      } else if (error instanceof Error) {
        message = error.message;
      }
      console.log(error);
      sendNotification(message);
    }
  };

  return (
    <>
      <h1>Add new entry</h1>
      <Notification message={notification} />
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
