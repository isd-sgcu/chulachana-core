import { TextField, TextFieldProps } from '@material-ui/core'
import React, { useCallback } from 'react'

const NumberTextField: React.FC<
  TextFieldProps & { onChange: (...value: any[]) => void }
> = ({ onChange, ...props }) => {
  const onChangeFilterNumber = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value.replace(/\D/, ''))
    },
    [onChange]
  )
  return <TextField onChange={onChangeFilterNumber} {...props} />
}

export { NumberTextField }
