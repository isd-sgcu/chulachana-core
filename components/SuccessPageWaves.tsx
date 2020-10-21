import { useTheme } from '@material-ui/core'

export function SuccessPageWaves() {
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
        d="M0 52.8144L13.2917 54.4872C26.5833 56.1601 53.1667 59.5058 79.75 61.1787C106.333 62.8515 132.917 62.8515 159.5 57.8329C186.083 52.8144 212.667 42.7773 239.25 39.4316C265.833 36.0858 292.417 39.4316 305.708 41.1044L319 42.7773V103H305.708C292.417 103 265.833 103 239.25 103C212.667 103 186.083 103 159.5 103C132.917 103 106.333 103 79.75 103C53.1667 103 26.5833 103 13.2917 103H0V52.8144Z"
        fill={theme.palette.primary.light}
      />
    </svg>
  )
}
