import { useState } from 'react';

export const useTextField = (input: string, type: string = 'text') => {
  const [value, setValue] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setValue(e.target.value);
  const clean = () => setValue('');
  const props = { value, onChange, name: input, type };
  const field = <input {...props} />;
  return { value, field, props, clean };
};
