import { useState } from 'react'

export const useField = (type, name = '') => {
    const [value, setValue] = useState('')
    const onChange = (e) => setValue(e.target.value)
    const basicField = { type, value, onChange }
    return name?{...basicField, name }:basicField
}