import { useInputField, useRadioButtonField, InputField } from '../../hooks';
import patientService from '../../services/patients';
import { useEffect, useState } from 'react';
import { Button, Input } from '@mui/material';
import { Entry, EntryFormValues, EntryType } from '../../types';
import { newEntryStyle, parStyle } from '../../styles';
import { useNotification } from '../../context/NotificationContext';
import { AxiosError } from 'axios';
import { getEntryTypeFromString, getStringNameFromType } from '../../utils';

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
  const entryTypeField = useRadioButtonField(
    'entryType',
    Object.values(EntryType).map((e) => getStringNameFromType(e)),
    getStringNameFromType(EntryType.Hospital)
  );
  const [entryType, setEntryType] = useState<EntryType>();
  useEffect(
    () => setEntryType(getEntryTypeFromString(entryTypeField.value)),
    [entryTypeField.value]
  );

  const descField = useInputField({ placeholder: 'Description' });
  const dateField = useInputField({ type: 'date', placeholder: 'Date' });
  const specialistField = useInputField({ placeholder: 'Specialist' });
  const diagnosisField = useInputField({ placeholder: 'Diagnosis' });
  const employerField = useInputField({ placeholder: 'Employer' });
  const sickLeaveStartField = useInputField({
    type: 'date',
    placeholder: 'Started',
  });
  const sickLeaveEndField = useInputField({
    type: 'date',
    placeholder: 'Ended',
  });
  const dischargeDateField = useInputField({
    type: 'date',
    placeholder: 'Date',
  });
  const dischargeCriteriaField = useInputField({ placeholder: 'Criteria' });
  const healthRatingField = useInputField({
    placeholder: 'Health rating',
    type: 'number',
  });

  const cleanFields = () => {
    descField.clean();
    dateField.clean();
    specialistField.clean();
    healthRatingField.clean();
    diagnosisField.clean();
    dischargeCriteriaField.clean();
    dischargeDateField.clean();
    sickLeaveStartField.clean();
    sickLeaveEndField.clean();
    employerField.clean();
  };

  const handleAddEntry = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      switch (entryType) {
        case EntryType.Hospital: {
          const entryData: EntryFormValues = {
            description: descField.value,
            date: dateField.value,
            specialist: specialistField.value,
            diagnosisCodes:
              diagnosisField.value.trim().length > 0
                ? diagnosisField.value.split(', ')
                : undefined,
            type: EntryType.Hospital,
            discharge: {
              date: dischargeDateField.value,
              criteria: dischargeCriteriaField.value,
            },
          };
          await addEntry(entryData);
          break;
        }
        case EntryType.OccupationalHealthcare: {
          const entryData: EntryFormValues = {
            description: descField.value,
            date: dateField.value,
            specialist: specialistField.value,
            diagnosisCodes:
              diagnosisField.value.trim().length > 0
                ? diagnosisField.value.split(', ')
                : undefined,
            type: EntryType.OccupationalHealthcare,
            employerName: employerField.value,
            sickLeave: {
              startDate: sickLeaveStartField.value,
              endDate: sickLeaveEndField.value,
            },
          };
          await addEntry(entryData);
          break;
        }
        case EntryType.HealthCheck: {
          if (!healthRatingField.value) {
            showError('Health rating is required');
            return;
          }
          const entryData: EntryFormValues = {
            description: descField.value,
            date: dateField.value,
            specialist: specialistField.value,
            diagnosisCodes:
              diagnosisField.value.trim().length > 0
                ? diagnosisField.value.split(', ')
                : undefined,
            type: EntryType.HealthCheck,
            healthCheckRating: Number(healthRatingField.value),
          };
          await addEntry(entryData);
          break;
        }
        default:
          throw new Error('Wrong Entry Type: ' + entryTypeField.value);
      }
      cleanFields();
    } catch (e: unknown) {
      const errorMessage =
        e instanceof AxiosError
          ? e.response?.data.error
          : e instanceof Error
            ? e.message
            : 'Error adding Entry';
      showError(errorMessage);
    }
  };

  if (!entryType) {
    return <>Loading...</>;
  }

  return (
    <div style={newEntryStyle}>
      <h3>New {entryTypeField.value} Entry</h3>

      <p>
        <b>Type:</b>
        {entryTypeField.field}
      </p>

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
          <b>Diagnosis codes: </b>
          <Input {...diagnosisField.props} />
        </div>
        <AdditionalEntryFields
          type={entryType}
          healthRatingField={healthRatingField}
          dischargeCriteriaField={dischargeCriteriaField}
          dischargeDateField={dischargeDateField}
          sickLeaveEndField={sickLeaveEndField}
          sickLeaveStartField={sickLeaveStartField}
          employerField={employerField}
        />
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

interface AdditionalEntryFieldProps {
  type: EntryType;
  healthRatingField: InputField;
  dischargeCriteriaField: InputField;
  dischargeDateField: InputField;
  sickLeaveEndField: InputField;
  sickLeaveStartField: InputField;
  employerField: InputField;
}

const AdditionalEntryFields = (props: AdditionalEntryFieldProps) => {
  switch (props.type) {
    case EntryType.Hospital:
      return (
        <>
          <p>
            <b>Discharge data:</b>
          </p>
          <ul>
            <li>
              <b>Date: </b>
              <Input {...props.dischargeDateField.props} />
            </li>
            <div>
              <li>
                <b>Criteria: </b>{' '}
                <Input {...props.dischargeCriteriaField.props} />
              </li>
            </div>
          </ul>
        </>
      );
    case EntryType.HealthCheck:
      return (
        <div>
          <b>Healt Check Rating: </b>{' '}
          <Input {...props.healthRatingField.props} />
        </div>
      );
    case EntryType.OccupationalHealthcare:
      return (
        <>
          <b>Employer: </b> <Input {...props.employerField.props} />
          <p>
            <b>Sick Leave Data:</b>
          </p>
          <ul>
            <li>
              <b>Started: </b>
              <Input {...props.sickLeaveStartField.props} />
            </li>
            <div>
              <li>
                <b>Ended: </b> <Input {...props.sickLeaveEndField.props} />
              </li>
            </div>
          </ul>
        </>
      );
  }
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
