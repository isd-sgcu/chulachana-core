export interface CheckProps {
  isCheckOut: boolean
}

export default function Check({ isCheckOut }: CheckProps) {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="15"
        cy="15"
        r="15"
        fill={isCheckOut ? '#F2994A' : '#219653'}
      />
      <path
        d="M22.4999 8.9993L11.9999 20.9993L7.49994 16.4993"
        stroke="white"
        strokeWidth="2.0625"
        strokeMiterlimit="10"
        strokeLinecap="square"
      />
    </svg>
  )
}
