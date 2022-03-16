import { MenuItem, TextField } from '@material-ui/core'
import { Controller, ControllerProps, useFormContext } from 'react-hook-form'
import { yearSelectionList } from '../utils/constant'

type YearFieldProps = Partial<ControllerProps<undefined>> & {
  yearError?: boolean
  className?: string
  disabled?: boolean
}

export function YearField({
  yearError,
  className,
  disabled,
  ...rest
}: YearFieldProps) {
  const { control, errors } = useFormContext()
  const error = !!errors.name || yearError
  return (
    <Controller
      name="year"
      control={control}
      rules={{ required: true }}
      {...rest}
      render={(controllerProps) => (
        <TextField
          {...controllerProps}
          style={{ width: '33%' }}
          value={controllerProps.value || ''}
          name="year"
          className={className}
          label="ชั้นปี"
          autoComplete="year"
          type="text"
          variant="outlined"
          size="small"
          error={error}
          helperText={error ? 'กรุณาเลือกชั้นปี' : undefined}
          disabled={disabled}
          autoFocus
          fullWidth
          select
        >
          {yearSelectionList.map((item, idx) => (
            <MenuItem value={item.value} key={`year-${idx}`}>
              {item.content}
            </MenuItem>
          ))}
        </TextField>
      )}
    />
  )
}
