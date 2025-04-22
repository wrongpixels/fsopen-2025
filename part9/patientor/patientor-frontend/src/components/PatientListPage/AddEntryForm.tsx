import { useRadioButtonField, useDefaultFields } from '../../hooks';
import patientService from '../../services/patients';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { DefaultFields, Entry, EntryFormValues, EntryType } from '../../types';
import { newEntryStyle } from '../../styles';
import {
  assertNever,
  getEntryTypeFromString,
  getStringNameFromType,
} from '../../utils';
import HospitalEntryForm from './HospitalEntryForm';
import HealthCheckEntryForm from './HealthCheckEntryForm';
import OccupationalHealthcare from './OccupationalHealthcareEntryForm';

interface Props {
  entries: Entry[];
  patientId: string;
  setEntries: React.Dispatch<React.SetStateAction<Entry[] | undefined>>;
}
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

interface EntryFormProps {
  addEntry: (addEntry: EntryFormValues) => Promise<void>;
}

const NewEntryForm = ({ addEntry }: EntryFormProps) => {
  const defaultFields = useDefaultFields();
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
      <EntryByType
        entryType={entryType}
        defaultFields={defaultFields}
        addEntry={addEntry}
      />
    </div>
  );
};

interface EntryByTypeProps {
  entryType: EntryType;
  defaultFields: DefaultFields;
  addEntry: EntryFormProps['addEntry'];
}

const EntryByType = (props: EntryByTypeProps) => {
  switch (props.entryType) {
    case EntryType.HealthCheck:
      return (
        <HealthCheckEntryForm
          defaultFields={props.defaultFields}
          addEntry={props.addEntry}
        />
      );
    case EntryType.Hospital:
      return (
        <HospitalEntryForm
          defaultFields={props.defaultFields}
          addEntry={props.addEntry}
        />
      );
    case EntryType.OccupationalHealthcare:
      return (
        <OccupationalHealthcare
          defaultFields={props.defaultFields}
          addEntry={props.addEntry}
        />
      );
    default:
      return assertNever(props.entryType);
  }
};

export default AddEntryForm;
