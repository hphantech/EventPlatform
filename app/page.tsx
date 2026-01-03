import ExploreBtn from '@/components/ExploreBtn'
import NavBar from '@/components/NavBar'
import React from 'react'
import EventCard from '@/components/EventCard'

const event = [
  {
    title: 'Tech Conference 2024',
    image: '/images/event1.png',
  },
  {
    title: 'Design Workshop',
    image: '/images/event2.png',
  },
  {
    title: 'Startup Pitch Night',
    image: '/images/event3.png',
  },
]
const page = () => {
  return (
    <section>
      <h1 className='text-center'>Welcome to Our Event Platform <br /> find events you can't miss</h1>
      <p className='text-center mt-5'>Hackathons, meetups, and conferences all in one place</p>

      <ExploreBtn />
      

      <div className='mt-20 space-y-7'>
        <h3>Featured Events</h3>

        <ul className='events'>
            {event.map((event) => (
              <li key={event.title}>
                <EventCard {...event} />

              </li>

              ))}
            

        </ul>


      </div>
    </section>
  )
}

export default page