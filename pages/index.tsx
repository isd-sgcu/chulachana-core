import { List, ListItem } from '@material-ui/core'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { PageLayout } from '../components/PageLayout'
import { EventInfo, getEvents } from '../models/prisma/event'

interface HomeProps {
  events: EventInfo[]
}

export default function Home({ events }: HomeProps) {
  return (
    <>
      <Head>
        <title>CU Check In</title>
      </Head>
      <PageLayout>
        <h1
          style={{
            margin: 0,
            paddingTop: 16,
            paddingLeft: 16,
            paddingRight: 16,
          }}
        >
          CU Check In
        </h1>
        <List component="nav">
          {events.map((event) => (
            <Link
              key={event.id}
              href="/[eventId]/[role]"
              as={`/${event.id}/${event.roles[0].slug}`}
              passHref
            >
              <ListItem button component="a">
                {event.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </PageLayout>
    </>
  )
}

export async function getServerSideProps() {
  return { props: { events: await getEvents() } }
}
