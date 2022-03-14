import { createMuiTheme, ThemeOptions, ThemeProvider } from '@material-ui/core'
import { createContext, useContext, useMemo } from 'react'
import { EventInfo } from '../models/redis/event'
import { appThemeOptions } from '../utils/theme'

interface EventConstruct {
  eventInfo: EventInfo
}

const EventContext = createContext({} as EventConstruct)

type EventProviderProps = React.PropsWithChildren<{
  eventInfo: EventInfo
  isStaff?: boolean
}>

export function EventProvider({
  eventInfo,
  isStaff,
  children,
}: EventProviderProps) {
  const { primaryColor, secondaryColor } = eventInfo
  const themeOptions: ThemeOptions = useMemo(
    () =>
      createMuiTheme({
        ...appThemeOptions,
        palette: {
          primary: {
            main: isStaff
              ? `#${eventInfo.secondaryColor}`
              : `#${eventInfo.primaryColor}`,
          },
          secondary: {
            main: isStaff
              ? `#${eventInfo.primaryColor}`
              : `#${eventInfo.secondaryColor}`,
          },
        },
      }),
    [primaryColor, secondaryColor]
  )
  return (
    <EventContext.Provider value={{ eventInfo }}>
      <ThemeProvider theme={themeOptions}>{children}</ThemeProvider>
    </EventContext.Provider>
  )
}

export function useEventContext() {
  return useContext(EventContext)
}
