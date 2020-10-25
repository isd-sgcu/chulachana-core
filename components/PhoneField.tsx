import { Controller, ControllerProps, useFormContext } from 'react-hook-form'
import { phoneRegex } from '../utils/frontend-utils'
import { NumberTextField } from './NumberTextField'

type PhoneFieldProps = Partial<ControllerProps<undefined>> & {
  phoneError?: boolean
  className?: string
  disabled?: boolean
}

export function PhoneField({
  phoneError,
  className,
  disabled,
  ...rest
}: PhoneFieldProps) {
  const { control, errors } = useFormContext()
  const error = !!errors.phone || phoneError
  return (
    <Controller
      name="phone"
      control={control}
      rules={{ required: true, pattern: phoneRegex }}
      {...rest}
      render={(controllerProps) => (
        <NumberTextField
          {...controllerProps}
          value={controllerProps.value || ''}
          name="phone"
          className={className}
          label="หมายเลขโทรศัพท์"
          autoComplete="tel"
          type="tel"
          variant="outlined"
          size="small"
          error={error}
          helperText={error ? 'หมายเลขโทรศัพท์ไม่ถูกต้อง' : undefined}
          disabled={disabled}
          autoFocus
          fullWidth
        />
      )}
    />
  )
}
