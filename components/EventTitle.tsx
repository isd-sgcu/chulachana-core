import { makeStyles } from '@material-ui/core'
import { personTypeNames } from '../utils/frontend-utils'
import { EventInfoDto, PersonType } from '../utils/types'

interface EventTitleProps {
  className?: string
  eventInfo: EventInfoDto
  type: PersonType
}

const useStyles = makeStyles({
  container: {
    paddingTop: 16,
    paddingBottom: 16,
    textAlign: 'center',
  },
  eventName: {
    fontWeight: 600,
    fontSize: 24,
    color: 'black',
    margin: 0,
  },
  typeName: {
    fontWeight: 600,
    fontSize: 18,
    color: 'rgba(0, 0, 0, 0.6)',
    margin: 0,
  },
})

export function EventTitle({ className, eventInfo, type }: EventTitleProps) {
  const classes = useStyles()
  return (
    <div className={`${classes.container} ${className}`}>
      <h1 className={classes.eventName}>{eventInfo.name}</h1>
      <h2 className={classes.typeName}>{personTypeNames[type]}</h2>
    </div>
  )
}
