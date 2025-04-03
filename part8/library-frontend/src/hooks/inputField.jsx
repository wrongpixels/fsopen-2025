import { useState } from 'react'

export const useInputField = (type = 'text', name = '', placeholder = '') => {
  const [value, setValue] = useState('')
  const onChange = (e) => setValue(e.target.value)
  const props = { value, type, name, placeholder, onChange }
  const clean = () => setValue('')
  const field = <input {...props} />
  return { value, props, field, clean }
}
