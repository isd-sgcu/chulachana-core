import { TextField } from '@material-ui/core'
import { Controller, ControllerProps, useFormContext } from 'react-hook-form'

type NameFieldProps = Partial<ControllerProps<undefined>> & {
  nameError?: boolean
  className?: string
  disabled?: boolean
}

export function NameField({
  nameError,
  className,
  disabled,
  ...rest
}: NameFieldProps) {
  const { control, errors } = useFormContext()
  const error = !!errors.name || nameError
  return (
    <Controller
      name="name"
      control={control}
      rules={{ required: true }}
      {...rest}
      render={(controllerProps) => (
        <TextField
          {...controllerProps}
          value={controllerProps.value || ''}
          name="name"
          className={className}
          label="ชื่อ-นามสกุล"
          autoComplete="name"
          type="text"
          variant="outlined"
          size="small"
          error={error}
          helperText={error ? 'กรุณากรอกชื่อของคุณ' : undefined}
          disabled={disabled}
          autoFocus
          fullWidth
        />
      )}
    />
  )
}
