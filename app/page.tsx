import ExploreBtn from '@/components/ExploreBtn'
import React from 'react'

const page = () => {
  return (
    <section>
      <h1 className='text-center'>Welcome to Our Event Platform <br /> find events you can't miss</h1>
      <p className='text-center mt-5'>Hackathons, meetups, and conferences all in one place</p>

      <ExploreBtn />
    </section>
  )
}

export default page