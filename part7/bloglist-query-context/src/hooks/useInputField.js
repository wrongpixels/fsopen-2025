import { useState } from "react";

const useInputField = (type, name = "") => {
  const [value, setValue] = useState("");
  const onChange = (event) => setValue(event.target.value);
  const clean = () => setValue("");
  return {
    props: name ? { value, onChange, type, name } : { value, onChange, type },
    value,
    clean,
  };
};

export default useInputField;
