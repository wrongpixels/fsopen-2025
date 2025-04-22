import { Input } from '@mui/material';
import { useState } from 'react';
import { DefaultFields } from './types';

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

export const useDefaultFields = (): DefaultFields => {
  const descField = useInputField({ placeholder: 'Description' });
  const dateField = useInputField({ type: 'date', placeholder: 'Date' });
  const specialistField = useInputField({ placeholder: 'Specialist' });
  const diagnosisField = useInputField({ placeholder: 'Diagnosis' });

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
        <Input {...diagnosisField.props} />
      </div>
    </>
  );
  const cleanAll = () => {
    dateField.clean();
    descField.clean();
    specialistField.clean();
    diagnosisField.clean();
  };
  const baseEntryData = {
    description: descField.value,
    date: dateField.value,
    specialist: specialistField.value,
    diagnosisCodes:
      diagnosisField.value.trim().length > 0
        ? diagnosisField.value.split(', ')
        : undefined,
  };
  return {
    dateField,
    descField,
    specialistField,
    diagnosisField,
    drawForm,
    cleanAll,
    baseEntryData,
  };
};
