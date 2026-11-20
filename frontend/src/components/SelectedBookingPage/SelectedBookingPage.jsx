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
import { faCircleInfo, faClock, faCouch, faDisplay, faLocationDot, faMoneyBill, faTicket } from '@fortawesome/free-solid-svg-icons';

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


  const handleCancelBooking = async () => {
    // first use the builtin confirm dialog to ask the user if they are sure they want to cancel the booking
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.");
    if (!confirmCancel) {
      return;
    }

    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`http://localhost:4000/api/bookings/cancel/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ bookingId: bookingId }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to cancel booking');
      }
      console.log('Booking cancelled:', data);
      alert('Booking cancelled successfully');

      // refresh the booking info to reflect the cancelled status
      fetchBookingInfo();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      setError(true);
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full min-h-screen flex flex-col items-start justify-start gap-8 lg:p-8">
      <h3 className="text-3xl font-bold">{translations.ticketInfo.title[lang]}</h3>
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
              style: "rounded"
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
        <div className='bg-tertiary p-8 rounded-2xl flex flex-col justify-start items-center lg:items-start gap-4 w-full'>
          <h4 className="text-3xl font-bold text-center w-full">{translations.ticketInfo.title[lang]}</h4>
          <div className='flex items-center gap-2'>
            <FontAwesomeIcon icon={faCouch} size="2x" />
            <h4 className="text-xl">{bookingInfo.seats.length === 1 ? translations.ticketInfo.seat1[lang] : translations.ticketInfo.seat2[lang]}</h4>
          </div>

          <div className="flex flex-row lg:justify-start justify-center gap-4 w-full flex-wrap">
            {bookingInfo.seats.map((seat, index) => (
              <p key={index} className="text-lg bg-secondary text-white p-2 font-bold rounded">{seat.seatCode}</p>
            ))}
          </div>

          <div className='flex flex-col lg:flex-row lg:justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faCircleInfo} size="2x" />
              <h4 className="text-xl">{translations.ticketInfo.status[lang]}</h4>
            </div>
            <p className={`text-lg p-2 font-bold rounded-full ${bookStatus[bookingInfo.status].color}`}>{bookStatus[bookingInfo.status][lang]}</p>
          </div>
          
          <div className='flex flex-col lg:flex-row lg:justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faTicket} size="2x" />
              <h4 className="text-xl">{translations.ticketInfo.movie[lang]}</h4>
            </div>
            <p className={`text-lg`}>{lang === 'en' ? bookingInfo.showtime.movie.titleEN : bookingInfo.showtime.movie.titleAR}</p>
          </div>

          <div className='flex flex-col lg:flex-row lg:justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faDisplay} size="2x" />
              <h4 className="text-xl">{translations.ticketInfo.screen[lang]}</h4>
            </div>
            <p className={`text-lg`}>{lang === 'en' ? bookingInfo.showtime.screen.nameEN : bookingInfo.showtime.screen.nameAR}</p>
          </div>

          <div className='flex flex-col lg:flex-row lg:justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faLocationDot} size="2x" />
              <h4 className="text-xl">{translations.ticketInfo.location[lang]}</h4>
            </div>
            <p className={`text-lg`}>{lang === 'en' ? bookingInfo.showtime.cinema.nameEN : bookingInfo.showtime.cinema.nameAR}</p>
          </div>

          <div className='flex flex-col lg:flex-row lg:justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faClock} size="2x" />
              <h4 className="text-xl">{translations.ticketInfo.showtime[lang]}</h4>
            </div>
            <p className={`text-lg`}>{new Date(bookingInfo.showtime.startTime).toLocaleString(lang === 'en' ? 'en-GB' : 'ar-EG')}</p>
          </div>

          <div className='flex flex-col lg:flex-row lg:justify-between w-full items-center gap-2'>
            <div className='flex items-center gap-2'>
              <FontAwesomeIcon icon={faMoneyBill} size="2x" />
              <h4 className="text-xl">{translations.ticketInfo.finalPrice[lang]}</h4>
            </div>
            <p className={`text-lg`}>{lang === 'en' ? `${bookingInfo.price} EGP` : `${bookingInfo.price} جنيه `}</p>
          </div>
          {bookingInfo.status === "confirmed" && (new Date(bookingInfo.showtime.startTime) - new Date()) > 30 * 60 * 1000 && (<>
            <button className="bg-red-500 hover:bg-red-700 hover:cursor-pointer transition-all text-white font-bold py-2 px-4 rounded" onClick={handleCancelBooking}>
              {translations.ticketInfo.cancelBooking[lang]}
            </button>
          </>)}
        </div>
      </div>)}
    </div>
  );
}