import { Button, Input } from '@mui/material';
import { useInputField, useNotification } from '../../hooks';
import { EntryFormValues, EntryProps, EntryType } from '../../types';
import { parStyle } from '../../styles';
import { manageEntryErrors } from '../../utils';

const HealthCheckEntryForm = ({ addEntry, defaultFields }: EntryProps) => {
  const { showError } = useNotification();
  const healthRatingField = useInputField({
    placeholder: 'Health rating',
    type: 'number',
  });
  const handleAddEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!healthRatingField.value) {
      showError('A Health Check Rating value is required.');
      return;
    }

    try {
      const entryData: EntryFormValues = {
        ...defaultFields.baseEntryData,
        type: EntryType.HealthCheck,
        healthCheckRating: Number(healthRatingField.value),
      };
      await addEntry(entryData);
      defaultFields.cleanAll();
      healthRatingField.clean();
    } catch (e: unknown) {
      showError(manageEntryErrors(e));
    }
  };
  return (
    <>
      <form onSubmit={handleAddEntry}>
        {defaultFields.drawForm()}
        <div>
          <b>Health Check Rating: </b> <Input {...healthRatingField.props} />
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
    </>
  );
};

export default HealthCheckEntryForm;
