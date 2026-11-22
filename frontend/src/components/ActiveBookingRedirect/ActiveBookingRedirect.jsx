import React, { useEffect, useState } from 'react';
import styles from './ActiveBookingRedirect.module.css';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { getAccountContext } from '../../contexts/AccountContext';

export default function ActiveBookingRedirect() {

  const [activeBooking, setactiveBooking] = useState(null);

  const { accessToken } = getAccountContext();

  const { lang } = useLanguage();

  const fetchActiveBooking = async () => {
    try {
      const response = await fetch('/api/bookings/active', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch active booking');
      }

      const data = await response.json();
      setactiveBooking(data);
      console.log('Fetched active booking:', data);
    } catch (error) {
      console.error('Error fetching active booking:', error);
      setactiveBooking(null);
    }
  };

  useEffect(() => {
    fetchActiveBooking();
  }, []);

  return (
    <>
    {activeBooking !== null && (
      <Link to={`/confirm-booking/${activeBooking.showtimeId}?active=${activeBooking.id}`} className="w-full bg-tertiary p-8 rounded-lg text-white flex items-center justify-center gap-4">
        <h4 className="text-lg font-semibold">{translations.activeBooking.message[lang]}</h4>
      </Link>
    )}
    </>
  );
}