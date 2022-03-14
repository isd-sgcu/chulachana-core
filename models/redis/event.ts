import { redisClient } from '../clients'

export async function getEvents() {
  const events = await redisClient.LRANGE('config:core:eventList', 0, -1)
  return events
}

export async function getEventConfig(eventId: string) {
  const config = await redisClient.HGETALL(`config:${eventId}`)
  return config
}
