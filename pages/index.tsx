import { List, ListItem } from '@material-ui/core'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'
import { getAllEvents } from '../api/events'
import { PageLayout } from '../components/PageLayout'
import { EventEntry } from '../utils/types'

interface HomeProps {
  events: EventEntry[]
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
              key={event.name}
              href="/[eventIdAndType]"
              as={`/${event.name}`}
              passHref
            >
              <ListItem button component="a">
                {event.info.name}
              </ListItem>
            </Link>
          ))}
        </List>
      </PageLayout>
    </>
  )
}

export async function getServerSideProps() {
  return { props: { events: await getAllEvents() } }
}
