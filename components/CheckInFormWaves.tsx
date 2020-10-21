import { useTheme } from '@material-ui/core'

export function CheckInFormWaves() {
  const theme = useTheme()
  return (
    <svg
      width="100%"
      viewBox="2 0 317 103"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M319 23.4751L305.708 26.1259C292.417 28.7768 265.833 34.0784 239.25 36.7292C212.667 39.3801 186.083 39.3801 159.5 31.4276C132.917 23.4751 106.333 7.57012 79.75 2.26846C53.1667 -3.0332 26.5833 2.26846 13.2917 4.91929L0 7.57012V103H13.2917C26.5833 103 53.1667 103 79.75 103C106.333 103 132.917 103 159.5 103C186.083 103 212.667 103 239.25 103C265.833 103 292.417 103 305.708 103H319V23.4751Z"
        fill={theme.palette.primary.light}
      />
    </svg>
  )
}
