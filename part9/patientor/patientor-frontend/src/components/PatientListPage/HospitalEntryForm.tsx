import { Button, Input } from '@mui/material';
import { useInputField, useNotification } from '../../hooks';
import { EntryFormValues, EntryProps, EntryType } from '../../types';
import { parStyle } from '../../styles';
import { manageEntryErrors } from '../../utils';

const HospitalEntryForm = ({ addEntry, defaultFields }: EntryProps) => {
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
        ...defaultFields.baseEntryData,
        type: EntryType.Hospital,
        discharge: {
          date: dischargeDateField.value,
          criteria: dischargeCriteriaField.value,
        },
      };
      await addEntry(entryData);
      defaultFields.cleanAll();
      dischargeDateField.clean();
      dischargeCriteriaField.clean();
    } catch (e: unknown) {
      showError(manageEntryErrors(e));
    }
  };
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
        <Button
          type="submit"
          variant="contained"
          color={'success'}
          style={parStyle}
        >
          Add
        </Button>
      </form>
    </>
  );
};

export default HospitalEntryForm;
