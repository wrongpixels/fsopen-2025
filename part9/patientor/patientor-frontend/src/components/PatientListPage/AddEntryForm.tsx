import { useInputField } from '../../hooks';
import patientService from '../../services/patients';
import { useState } from 'react';
import { Button, Input } from '@mui/material';
import { Entry, EntryFormValues } from '../../types';
import { newEntryStyle, parStyle } from '../../styles';
import { useNotification } from '../../context/NotificationContext';
import { AxiosError } from 'axios';

interface Props {
  entries: Entry[];
  patientId: string;
  setEntries: React.Dispatch<React.SetStateAction<Entry[] | undefined>>;
}

interface EntryFormProps {
  addEntry: (addEntry: EntryFormValues) => Promise<void>;
}

const NewEntryForm = ({ addEntry }: EntryFormProps) => {
  const { showError } = useNotification();
  const descField = useInputField({ placeholder: 'Description' });
  const dateField = useInputField({ type: 'date', placeholder: 'Date' });
  const specialistField = useInputField({ placeholder: 'Specialist' });
  const healthRatingField = useInputField({
    placeholder: 'Health rating',
    type: 'number',
  });
  const diagnosisField = useInputField({ placeholder: 'Diagnosis' });

  const handleAddEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!healthRatingField.value) {
      showError('Health rating is required');
      return;
    }
    try {
      await addEntry({
        description: descField.value,
        date: dateField.value,
        specialist: specialistField.value,
        healthCheckRating: Number(healthRatingField.value),
        diagnosisCodes:
          diagnosisField.value.trim().length > 0
            ? diagnosisField.value.split(', ')
            : undefined,
        type: 'HealthCheck',
      });
      descField.clean();
      dateField.clean();
      specialistField.clean();
      healthRatingField.clean();
      diagnosisField.clean();
    } catch (e: unknown) {
      const errorMessage =
        e instanceof AxiosError ? e.response?.data.error : 'Error adding Entry';
      showError(errorMessage);
    }
  };

  return (
    <div style={newEntryStyle}>
      <h3>New Entry</h3>
      <form onSubmit={handleAddEntry}>
        <div>
          <b>Description: </b>
          <Input {...descField.props} />
        </div>
        <div>
          <b>Date: </b>
          <Input {...dateField.props} />
        </div>
        <div>
          <b>Specialist: </b>
          <Input {...specialistField.props} />
        </div>
        <div>
          <b>Health rating: </b>
          <Input {...healthRatingField.props} />
        </div>
        <div>
          <b>Diagnosis codes: </b>
          <Input {...diagnosisField.props} />
        </div>
        <Button
          type="submit"
          variant="contained"
          color={'success'}
          style={parStyle}
        >
          Add
        </Button>
      </form>
    </div>
  );
};

const AddEntryForm = ({ entries, patientId, setEntries }: Props) => {
  const [visible, setVisible] = useState(false);

  const addEntry = async (entry: EntryFormValues) => {
    const newEntry = await patientService.addEntry(entry, patientId);
    setEntries([newEntry, ...entries]);
  };

  return (
    <>
      {visible && <NewEntryForm addEntry={addEntry} />}
      <Button
        variant="contained"
        color={visible ? 'error' : 'success'}
        onClick={() => setVisible(!visible)}
      >
        {visible ? 'Close New Entry Form' : 'Add New Entry'}
      </Button>
    </>
  );
};

export default AddEntryForm;
