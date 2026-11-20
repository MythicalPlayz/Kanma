import React, { useEffect, useState } from 'react';
import styles from './SelectedBookingPage.module.css';
import { useParams } from 'react-router-dom';
import { getAccountContext } from '../../contexts/AccountContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import translations from '../../lang/main.json';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';
import { ReactQRCode } from '@lglab/react-qr-code'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo, faClock, faCouch, faDisplay, faLocationDot, faTicket } from '@fortawesome/free-solid-svg-icons';

export default function SelectedBookingPage() {

  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);


  const bookStatus = {
    "pending": {
      "en": "Pending",
      "ar": "قيد الانتظار",
      "color": "bg-yellow-500"
    },
    "confirmed": {
      "en": "Confirmed",
      "ar": "تم التأكيد",
      "color": "bg-green-500"
    },
    "cancelled": {
      "en": "Cancelled",
      "ar": "ملغى",
      "color": "bg-red-500"
    },
  }

  const { bookingId } = useParams();
  const { accessToken } = getAccountContext();
  const navigate = useNavigate();
  const { lang } = useLanguage();

  const fetchBookingInfo = async () => {
    setLoading(true);
    setError(false);
    try {

      if (!accessToken) {
        console.error('No access token available');
        navigate('/login');
        return;
      }




      const response = await fetch(`http://localhost:4000/api/bookings/booking?bookingId=${bookingId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch booking info');
      }
      setBookingInfo(data);
      console.log('Fetched booking info:', data);
    }
    catch (error) {
      console.error('Error fetching booking info:', error);
      setError(true);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchBookingInfo();
    }
  }, [accessToken, bookingId]);


  return (
    <div className="w-full min-h-screen flex flex-col items-start justify-start gap-8 p-8">
      <h3 className="text-3xl font-bold">Booking Info</h3>
      {loading && <LoadingElement />}
      {error && <ErrorElement />}
      {bookingInfo && (<div className="w-full p-8 gap-8 grid grid-cols-1 lg:grid-cols-2">
        {bookingInfo.status === "confirmed" && (<div className='w-full justify-center items-center flex flex-col gap-4'>
          <ReactQRCode value={bookingInfo.code} background="white"
            dataModulesSettings={{
              // style: "rounded"
            }}
            finderPatternOuterSettings={{
              style: "outpoint-lg"
            }}
            finderPatternInnerSettings={{
              // style: "star"
            }}
            imageSettings={{
              src: bookingInfo.showtime.cinema.imageURL,
              width: 60,
              height: 60,
              excavate: true,
              opacity: 1,
            }}
            frameSettings={{
              style: "ticket",
              color: "#3282b8",
              text: bookingInfo.code,
              fontFamily: "Poppins",
            }}
            size={256}
          />
        </div>)}
        <div className='bg-tertiary p-8 rounded-2xl flex flex-col justify-start items-start gap-4 w-full'>
          <h4 className="text-3xl font-bold text-center w-full">Ticket Info</h4>
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faCouch} size="2x" />
            <h4 className="text-xl">{bookingInfo.seats.length === 1 ? "Seat:" : "Seats:"}</h4>
          </div>

          <div className="flex flex-row gap-4 w-full flex-wrap">
            {bookingInfo.seats.map((seat, index) => (
              <p key={index} className="text-lg bg-secondary text-white p-2 font-bold rounded">{seat.seatCode}</p>
            ))}
          </div>

          <div className='flex justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faCircleInfo} size="2x" />
              <h4 className="text-xl">Status:</h4>
            </div>
            <p className={`text-lg p-2 font-bold rounded-full ${bookStatus[bookingInfo.status].color}`}>{bookStatus[bookingInfo.status][lang]}</p>
          </div>
          
          <div className='flex justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faTicket} size="2x" />
              <h4 className="text-xl">Movie:</h4>
            </div>
            <p className={`text-lg`}>{bookingInfo.showtime.movie.titleEN}</p>
          </div>

          <div className='flex justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faDisplay} size="2x" />
              <h4 className="text-xl">Screen:</h4>
            </div>
            <p className={`text-lg`}>{bookingInfo.showtime.screen.nameEN}</p>
          </div>

          <div className='flex justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faLocationDot} size="2x" />
              <h4 className="text-xl">Location:</h4>
            </div>
            <p className={`text-lg`}>{bookingInfo.showtime.cinema.nameEN}</p>
          </div>

          <div className='flex justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faClock} size="2x" />
              <h4 className="text-xl">Showtime:</h4>
            </div>
            <p className={`text-lg`}>{new Date(bookingInfo.showtime.startTime).toLocaleString(lang === 'en' ? 'en-GB' : 'ar-EG')}</p>
          </div>
        </div>
      </div>)}
    </div>
  );
}