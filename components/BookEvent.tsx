'use client'
import React from 'react'
import { useState } from 'react';

const BookEvent = () => {

    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const handleSubmit = (e: React.FormEvent) => { 
        e.preventDefault();

        setTimeout(() => {
            setSubmitted(true);
        },1000);

    

    }


  return (
    <div id="book-event">
        {submitted ? (
            <p className='text-sm'>Thank you for booking your spot!</p>
        ) : (
            <form onSubmit={handleSubmit}>
                <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    placeholder='enter your email' />
                    </div>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                }}>Book Now</button>
                    </form>
        )}
                    
    </div>
        
  )
}

export default BookEvent