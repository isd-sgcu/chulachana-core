import { MenuItem, TextField } from '@material-ui/core'
import { Controller, ControllerProps, useFormContext } from 'react-hook-form'
import { facultySelectionList } from '../utils/constant'

type FacultyFieldProps = Partial<ControllerProps<undefined>> & {
  facultyError?: boolean
  className?: string
  disabled?: boolean
}

export function FacultyField({
  facultyError,
  className,
  disabled,
  ...rest
}: FacultyFieldProps) {
  const { control, errors } = useFormContext()
  const error = !!errors.name || facultyError
  return (
    <Controller
      name="faculty"
      control={control}
      rules={{ required: true }}
      {...rest}
      render={(controllerProps) => (
        <TextField
          style={{ width: '66%' }}
          {...controllerProps}
          value={controllerProps.value || ''}
          name="faculty"
          className={className}
          label="คณะ"
          autoComplete="faculty"
          type="text"
          variant="outlined"
          size="small"
          error={error}
          helperText={error ? 'กรุณาเลือกคณะ' : undefined}
          disabled={disabled}
          select
          fullWidth
        >
          {facultySelectionList.map((item, idx) => (
            <MenuItem value={item.value} key={`faculty-${idx}`}>
              {item.content}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}
