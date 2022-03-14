import { ApiError } from '../../utils/types'
import { redisClient } from '../clients'

export async function getEvents() {
  const eventIds = await redisClient.lrange('config:core:eventList', 0, -1)
  const events = await Promise.all(
    eventIds.map(async (eventId) => getEventInfo(eventId))
  )
  return events
}

export interface EventInfo {
  id: string
  name: string
  primaryColor: string
  secondaryColor: string
  roles: Record<string, string>
}

export async function getEventInfo(eventId: string): Promise<EventInfo> {
  const info = await redisClient.hgetall(`config:${eventId}:info`)
  const roles = await redisClient.hgetall(`config:${eventId}:roles`)
  if (Object.keys(info).length === 0 || Object.keys(roles).length === 0) {
    return null
  }

  return {
    id: eventId,
    name: info.name,
    primaryColor: info.primaryColor,
    secondaryColor: info.secondaryColor,
    roles,
  }
}

export async function ensureEventExists(eventId: string) {
  const exists = await redisClient.exists(
    `config:${eventId}:info`,
    `config:${eventId}:roles`
  )
  if (!exists) {
    throw new ApiError(404, `Event ${eventId} does not exist`)
  }
}
