'use client';

import { createBooking } from '@/lib/actions/booking.actions';
import posthog from 'posthog-js';
import { useState } from 'react';

const BookEvent = ({ eventId, slug }: { eventId: string; slug: string }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);

    const { success } = await createBooking({ eventId, slug, email });

    if (success) {
      posthog.capture('event_booked', {
        event_id: eventId,
        event_slug: slug,
        email_domain: email.split('@')[1] ?? 'unknown', // SAFE, not PII
        source: 'event_page',
      });

      setSubmitted(true);
    } else {
      posthog.capture('booking_failed', {
        event_id: eventId,
        event_slug: slug,
      });
      setLoading(false);
    }
  };

  if (submitted) {
    return <p className="text-sm">Thank you for booking your spot!</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label className="block text-sm font-medium mb-2">Email Address</label>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="enter your email"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Booking…' : 'Book Now'}
      </button>
    </form>
  );
};

export default BookEvent;
 