import { useMemo } from 'react'
import { PersonType } from './types'

// TODO: deprecate this, use multiple path params instead
export function useEventType(eventIdAndType: string, defaultRole?: string) {
  return useMemo(() => {
    const parts = eventIdAndType.split('-')
    let type = defaultRole
    if (parts.length > 1) {
      type = parts[parts.length - 1]
    }
    return type as PersonType
  }, [eventIdAndType])
}

export const phoneRegex = /^[0-9]{9,10}$/
