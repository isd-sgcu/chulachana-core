import { createContext, useContext, useMemo } from 'react'
import { ThemeProvider, createMuiTheme, ThemeOptions } from '@material-ui/core'
import { EventInfoDto } from '../utils/types'
import { appThemeOptions } from '../utils/theme'

interface EventConstruct {
  eventInfo: EventInfoDto
}

const EventContext = createContext({} as EventConstruct)

type EventProviderProps = React.PropsWithChildren<{
  eventInfo: EventInfoDto
}>

export function EventProvider({ eventInfo, children }: EventProviderProps) {
  const { primaryColor, secondaryColor } = eventInfo
  const themeOptions: ThemeOptions = useMemo(
    () =>
      createMuiTheme({
        ...appThemeOptions,
        palette: {
          primary: {
            main: `#${eventInfo.primaryColor}`,
          },
          secondary: {
            main: `#${eventInfo.secondaryColor}`,
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
