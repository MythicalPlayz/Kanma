import React, { useEffect, useState } from 'react';
import styles from './BookingsPage.module.css';
import { Link } from 'react-router-dom';
import { getAccountContext } from '../../contexts/AccountContext';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';
import { faClock, faDisplay, faLocationArrow, faLocationDot, faTicket } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function BookingsPage() {

  const [bookings, setBookings] = useState([]);
  const { accessToken } = getAccountContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch('http://localhost:4000/api/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bookings');
      }
      setBookings(data);
      console.log('Fetched bookings:', data);
    } catch (error) {
      setError(true);
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchBookings();
    }
  }, [accessToken]);

  return (
    <div className='p-8 min-h-screen flex flex-col justify-start items-center gap-8'>
      <h2 className='text-3xl font-bold'>My Bookings</h2>
      {loading && <LoadingElement />}
      {error && <ErrorElement />}
      <div className='w-full flex flex-col gap-8'>
        {bookings.length === 0 && !loading && !error && (
          <p className='text-center text-gray-500'>No bookings found.</p>
        )}
        {bookings.map((booking) => (
          <Link
            key={booking._id}
            to={`/account/bookings/${booking._id}`}
            className="flex flex-col gap-4 relative bg-tertiary text-white p-8 rounded-md"
          >
            <div className='flex flex-row justify-start items-center gap-4'>
              <FontAwesomeIcon icon={faTicket} className='text-2xl' />
              <p className="font-bold">{booking.showtimeId.movie.titleEN}</p>
            </div>
            <div className='flex flex-row justify-start items-center gap-4'>
              <FontAwesomeIcon icon={faDisplay} className='text-2xl' />
              <p className="font-bold">{booking.showtimeId.screen.nameEN}</p>
            </div>
            <div className='flex flex-row justify-start items-center gap-4'>
              <FontAwesomeIcon icon={faLocationDot} className='text-2xl' />
              <p className="font-bold">{booking.showtimeId.screen.nameEN}</p>
            </div>
            <div className='flex flex-row justify-start items-center gap-4'>
              <FontAwesomeIcon icon={faClock} className='text-2xl' />
              <p className="font-bold">{new Date(booking.showtimeId.startTime).toLocaleString()}</p>
            </div>
            <p className='absolute right-2 top-2 bg-green-500 p-2 rounded-full'>{(booking.status).toUpperCase()}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}