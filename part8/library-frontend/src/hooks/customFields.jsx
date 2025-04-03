import { useState } from 'react'
import Select from 'react-select'

export const useSelectionField = (options = []) => {
  const [value, setValue] = useState(null)
  const onChange = setValue
  const selectOptions = options.map((opt) => ({ value: opt, label: opt }))
  const field = (
    <Select options={selectOptions} onChange={onChange} value={value} />
  )
  return { value, field, onChange }
}

export const useInputField = (type = 'text', name = '', placeholder = '') => {
  const [value, setValue] = useState('')
  const onChange = (e) => setValue(e.target.value)
  const props = { value, type, name, placeholder, onChange }
  const clean = () => setValue('')
  const field = <input {...props} />
  return { value, props, field, clean }
}
