import { redisClient } from '../clients'

export async function getEvents() {
  const eventIds = await redisClient.LRANGE('config:core:eventList', 0, -1)
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
}

export async function getEventInfo(eventId: string): Promise<EventInfo> {
  const config = await redisClient.HGETALL(`config:${eventId}`)
  return {
    id: eventId,
    name: config.name,
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
  }
}
