import { useMemo } from 'react'
import { PersonType } from './types'

export function useEventType(eventIdAndType: string) {
  return useMemo(() => {
    const parts = eventIdAndType.split('-')
    let type = 'normal'
    if (parts.length > 1) {
      type = parts[parts.length - 1]
    }
    return type as PersonType
  }, [eventIdAndType])
}
