import { Button, Input } from '@mui/material';
import { useInputField, useNotification } from '../../hooks';
import { EntryFormValues, EntryProps, EntryType } from '../../types';
import { parStyle } from '../../styles';
import { manageEntryErrors } from '../../utils';

const OccupationalHealthcare = ({ addEntry, defaultFields }: EntryProps) => {
  const { showError } = useNotification();
  const employerField = useInputField({ placeholder: 'Employer' });
  const sickLeaveStartField = useInputField({
    type: 'date',
    placeholder: 'Started',
  });
  const sickLeaveEndField = useInputField({
    type: 'date',
    placeholder: 'Ended',
  });

  const handleAddEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const entryData: EntryFormValues = {
        ...defaultFields.baseEntryData,
        type: EntryType.OccupationalHealthcare,
        employerName: employerField.value,
        sickLeave: {
          startDate: sickLeaveStartField.value,
          endDate: sickLeaveEndField.value,
        },
      };
      await addEntry(entryData);
      defaultFields.cleanAll();
      employerField.clean();
      sickLeaveEndField.clean();
      sickLeaveStartField.clean();
    } catch (e: unknown) {
      showError(manageEntryErrors(e));
    }
  };
  return (
    <>
      <form onSubmit={handleAddEntry}>
        {defaultFields.drawForm()}
        <b>Employer: </b> <Input {...employerField.props} />
        <p>
          <b>Sick Leave Data:</b>
        </p>
        <ul>
          <li>
            <b>Started: </b>
            <Input {...sickLeaveStartField.props} />
          </li>
          <div>
            <li>
              <b>Ended: </b> <Input {...sickLeaveEndField.props} />
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

export default OccupationalHealthcare;
