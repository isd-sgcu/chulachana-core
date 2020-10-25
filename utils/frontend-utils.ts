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

export const phoneRegex = /^[0-9]{9,10}$/

export const personTypeNames: Record<PersonType, string> = {
  normal: 'ผู้เข้าร่วมงาน',
  staff: 'ผู้ปฏิบัติงาน',
  shop: 'ร้านค้าและสปอนเซอร์',
}
