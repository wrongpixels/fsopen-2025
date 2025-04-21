import { Input } from '@mui/material';
import { InputField, useInputField } from '../../hooks';
import { EntryFormValues, EntryType } from '../../types';
import { AxiosError } from 'axios';
import { useNotification } from '../../context/NotificationContext';

interface Props {
  addEntry: (entry: EntryFormValues) => Promise<void>;
  defaultFields: {
    dateField: InputField;
    descField: InputField;
    specialistField: InputField;
    diagnosisField: InputField;
    drawForm: () => JSX.Element;
  };
}

const HospitalEntryForm = ({ addEntry, defaultFields }: Props) => {
  const dischargeDateField = useInputField({
    type: 'date',
    placeholder: 'Date',
  });
  const dischargeCriteriaField = useInputField({ placeholder: 'Criteria' });
  const { showError } = useNotification();
  const handleAddEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const entryData: EntryFormValues = {
        description: defaultFields.descField.value,
        date: defaultFields.dateField.value,
        specialist: defaultFields.specialistField.value,
        diagnosisCodes:
          defaultFields.diagnosisField.value.trim().length > 0
            ? defaultFields.diagnosisField.value.split(', ')
            : undefined,
        type: EntryType.Hospital,
        discharge: {
          date: dischargeDateField.value,
          criteria: dischargeCriteriaField.value,
        },
      };
      await addEntry(entryData);
    } catch (e: unknown) {
      const errorMessage =
        e instanceof AxiosError
          ? e.response?.data.error
          : e instanceof Error
            ? e.message
            : 'Error adding Entry';
      showError(errorMessage);
    }
    return (
      <>
        <form onSubmit={handleAddEntry}>
          {defaultFields.drawForm()}
          <p>
            <b>Discharge data:</b>
          </p>
          <ul>
            <li>
              <b>Date: </b>
              <Input {...dischargeDateField.props} />
            </li>
            <div>
              <li>
                <b>Criteria: </b>
                <Input {...dischargeCriteriaField.props} />
              </li>
            </div>
          </ul>
        </form>
      </>
    );
  };
};

export default HospitalEntryForm;
