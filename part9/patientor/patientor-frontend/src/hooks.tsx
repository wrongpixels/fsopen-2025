import { Input, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useContext, useState } from 'react';
import { DefaultFields, Diagnosis, Notification } from './types';
import NotificationContext from './context/NotificationContext';

export const useNotification = () => {
  const { notification, setNotification, currentTimeout, setCurrentTimeout } =
    useContext(NotificationContext);
  const clearNotification = () =>
    newNotification({ message: '', isError: false });
  const newNotification = (not: Notification) => {
    if (currentTimeout) {
      clearTimeout(currentTimeout);
    }
    setNotification(not);
    if (not.message) {
      setCurrentTimeout(setTimeout(() => clearNotification(), 5000));
    }
  };
  const showError = (message: string) =>
    newNotification({ message, isError: true });
  const showNotification = (message: string) =>
    newNotification({ message, isError: false });
  return { notification, showError, showNotification };
};

const useDefaultField = (defOption: string = '') => {
  const [value, setValue] = useState<string>(defOption);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const clean = () => setValue('');
  return { value, setValue, onChange, clean };
};

interface fieldData {
  name?: string;
  type?: string | 'text';
  placeholder?: string;
  label?: string;
}

export interface InputField {
  value: string;
  field: JSX.Element;
  props: {
    name?: string;
    type?: string | 'text';
    placeholder?: string;
    label?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  };
  setValue: React.Dispatch<React.SetStateAction<string>>;
  clean: () => void;
}

export const useInputField = (data: fieldData): InputField => {
  const { value, onChange, clean, setValue } = useDefaultField();
  const props = { value, onChange, ...data };
  const field = <input {...props} />;
  return { value, field, props, setValue, clean };
};

export const useRadioButtonField = (
  name: string,
  options: string[],
  defOption: string = ''
) => {
  const { value, onChange, clean, setValue } = useDefaultField(defOption);
  const field = options.map((p, i) => (
    <span key={`radio${name}${i}`}>
      <input
        type="radio"
        name={name}
        value={p}
        checked={value === p}
        onChange={onChange}
      />
      {p}
    </span>
  ));
  return { value, field, setValue, clean };
};

export const useDefaultFields = (diagnoses: Diagnosis[]): DefaultFields => {
  const descField = useInputField({ placeholder: 'Description' });
  const dateField = useInputField({ type: 'date', placeholder: 'Date' });
  const specialistField = useInputField({ placeholder: 'Specialist' });
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Array<string>>([]);

  const onChange = (event: SelectChangeEvent<string[]>) => {
    if (Array.isArray(event.target.value)) {
      setSelectedDiagnoses(event.target.value);
    }
  };

  const drawForm = () => (
    <>
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
        {diagnoses && (
          <Select multiple value={selectedDiagnoses} onChange={onChange}>
            {diagnoses.map((c) => (
              <MenuItem key={c.code} value={c.code}>
                {c.code}
              </MenuItem>
            ))}
          </Select>
        )}
      </div>
    </>
  );
  const cleanAll = () => {
    dateField.clean();
    descField.clean();
    specialistField.clean();
    setSelectedDiagnoses([]);
  };
  const baseEntryData = {
    description: descField.value,
    date: dateField.value,
    specialist: specialistField.value,
    diagnosisCodes: selectedDiagnoses,
  };
  return {
    dateField,
    descField,
    specialistField,
    drawForm,
    cleanAll,
    baseEntryData,
  };
};
