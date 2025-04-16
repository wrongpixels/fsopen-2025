import { useState } from 'react';

const useDefaultField = () => {
  const [value, setValue] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const clean = () => setValue('');
  return { value, setValue, onChange, clean };
};

export const useInputField = (name: string, type: string = 'text') => {
  const { value, onChange, clean, setValue } = useDefaultField();
  const props = { value, onChange, name: name, type };
  const field = <input {...props} />;
  return { value, field, props, setValue, clean };
};

export const useRadioButtonField = (name: string, options: string[]) => {
  const { value, onChange, clean, setValue } = useDefaultField();
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
