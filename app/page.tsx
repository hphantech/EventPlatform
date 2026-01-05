import ExploreBtn from '@/components/ExploreBtn'
import NavBar from '@/components/NavBar'
import React from 'react'
import EventCard from '@/components/EventCard'

import { IEvent } from '@/database/event.model'
import { cacheLife } from 'next/cache'



const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
const page = async () => {
  'use cache';
  cacheLife('hours')


  let events = [];
  try {
    const response = await fetch(`${BASE_URL}/api/events`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      events = data.events ?? [];
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }

  return (
    <section>
      <h1 className='text-center'>Welcome to Our Event Platform <br /> find events you can't miss</h1>
      <p className='text-center mt-5'>Hackathons, meetups, and conferences all in one place</p>

      <ExploreBtn />
      
 
      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>

        <ul className='events'>
            {events && events.length > 0 && events.map((event : IEvent) => (
              <li key={event.title} className='list-none'>
                <EventCard {...event} />

              </li>

              ))}
            

        </ul>


      </div>
    </section>
  )
}

export default page