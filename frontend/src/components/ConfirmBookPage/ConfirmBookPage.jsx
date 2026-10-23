import React, { useEffect, useState } from 'react';
import styles from './ConfirmBookPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAccountContext } from '../../contexts/AccountContext';
import translations from '../../lang/main.json';

const seatColor = {
  N: 'bg-blue-500', // Normal
  P: 'bg-green-500', // Premium
}

export default function ConfirmBookPage() {
  const { showtimeId } = useParams();
  const [steps, setSteps] = useState(1);
  const [screenDetails, setScreenDetails] = useState(null);
  const { lang } = useLanguage();
  const { accessToken } = getAccountContext();
  const navigateTo = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatTypeDetails, setSeatTypeDetails] = useState({});
  const [seatPrices, setSeatPrices] = useState({});
  const [bankPublicKey, setBankPublicKey] = useState(null);
  const [serverPublicKey, setServerPublicKey] = useState(null);

  const fetchScreenDetails = async (showtimeId) => {
    if (!accessToken) {
      console.log('No access token found, redirecting to login page');
      navigateTo('/account/login');
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`http://localhost:4000/api/screens/showtime?showtimeId=${showtimeId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch screen details');
      }
      setScreenDetails(data.screen);
      formatSeatTypes(data.seatTypeDetails);
      fetchBookedSeats(showtimeId);
      console.log('Fetched screen details:', data);
    } catch (error) {
      console.error('Error fetching screens:', error);
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized access, redirecting to login page');
        navigateTo('/account/login');
      }
      setScreenDetails(null);
      setError(true);
    }
    finally {
      setLoading(false);
    }
  };

  const fetchBookedSeats = async (showtimeId) => {
    if (!accessToken) {
      console.log('No access token found, redirecting to login page');
      navigateTo('/account/login');
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`http://localhost:4000/api/showtimes/bookedseats?showtimeId=${showtimeId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch booked seats');
      }

      console.log('Fetched booked seats:', data);
      // Mark booked seats as unavailable
      for (const bookedSeat of data) {
        const seatButton = document.getElementById(bookedSeat.seatCode);
        if (seatButton) {
          seatButton.disabled = true;
          seatButton.classList.add('bg-gray-500', 'hover:cursor-not-allowed');
          seatButton.classList.remove('bg-blue-500', 'bg-green-500', 'hover:bg-amber-500');
          seatButton.innerText = `X`;
        }
      }
    } catch (error) {
      console.error('Error fetching booked seats:', error);
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized access, redirecting to login page');
        navigateTo('/account/login');
      }
      setError(true);
    }
    finally {
      setLoading(false);
    }
  };



  useEffect(() => {
    fetchScreenDetails(showtimeId);
    setPublicKeys();
  }, [showtimeId]);

  const handleSeatClick = (seatCode, seatType) => {
    if (selectedSeats.some(seat => seat.seatCode === seatCode)) {
      setSelectedSeats(selectedSeats.filter(seat => seat.seatCode !== seatCode));
    } else {
      const seatData = {
        seatCode: seatCode,
        seatType: seatType
      };
      setSelectedSeats([...selectedSeats, seatData]);
    }
  };

  useEffect(() => {
    calculateSeatPrices();
  }, [selectedSeats, seatTypeDetails]);

  const formatSeatTypes = (seatTypeDetails) => {
    let formattedDetails = {};
    seatTypeDetails.forEach(type => {
      formattedDetails[type.code] = {
        nameEN: type.nameEN,
        nameAR: type.nameAR,
        price: type.price
      };
    });
    setSeatTypeDetails(formattedDetails);
  };

  const calculateSeatPrices = () => {
    let prices = {
      tickets: {},
      total: 0
    };
    selectedSeats.forEach(seat => {
      const seatType = seat.seatType;
      const seatPrice = seatTypeDetails[seatType]?.price || 0;
      if (!prices.tickets[seatType]) {
        prices.tickets[seatType] = 0;
      }
      prices.tickets[seatType]++;
      prices.total += seatPrice;
    });
    console.log('Calculated seat prices:', prices);
    setSeatPrices(prices);
  };

  const setPublicKeys = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/auth/key');
      const data = await response.json();
      setBankPublicKey(data.publicKey);
      const response2 = await fetch('http://localhost:4000/bank/public-key');
      const data2 = await response2.json();
      setServerPublicKey(data2.publicKey);
      console.log('Fetched public keys:', data.publicKey, data2.publicKey);
    } catch (error) {
      console.error('Error fetching public keys:', error);
    }
  };

  const startBook = () => {
    if (selectedSeats.length === 0) {
      console.log('No seats selected, cannot proceed to booking');
      return;
    }
    console.log('Starting booking process with selected seats:', selectedSeats);

    const bookingData = {
      showtimeId: showtimeId,
      seats: selectedSeats,
      raw: true
    };

    // Send booking data to the backend to create a pending booking
   try {
    const response = fetch('http://localhost:4000/api/bookings/book', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(bookingData)
    });
    response.then(res => res.json()).then(data => {
      if (data.error) {
        console.error('Error creating booking:', data.error);
        return;
      }
      console.log('Booking created successfully:', data);
      // Move to the next step (Payment)
      setSteps(2);
    }).catch(err => {
      console.error('Error creating booking:', err);
    }
    );
   }  
  catch (error) {
    console.error('Error creating booking:', error);
  }
  };

  // 1 = Booking Details, 2 = Payment, 3 = OTP, 4 = Confirmation
  return (
    <div className="w-5-6 lg:w-3-4 mx-auto min-h-screen flex flex-col items-center justify-start p-8 my-8 gap-8">
      <h2 className="text-2xl font-bold">{translations.steps[lang].replace('#STEP', steps)}</h2>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-8 bg-secondary p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">{translations.selectSeats[lang]}</h2>
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="flex bg-black w-full h-8 justify-center items-center">
            <span className="text-white text-sm font-bold">{translations.screen[lang]}</span>
          </div>
          {screenDetails && screenDetails.seatLayout.map((row, rowIndex) => {
            const rowLetter = String.fromCharCode(65 + rowIndex);

            return (
              <div key={rowIndex} className="flex gap-8 w-full mx-auto justify-center relative" dir="ltr">
                {row.row.map((seats, blockIndex) => {
                  // Calculate the starting seat number by adding all seats before this section
                  const startNumber = row.row
                    .slice(0, blockIndex)
                    .reduce((sum, count) => sum + count, 0);

                  const seatType = row.seatType;

                  return (
                    <div key={blockIndex} className="flex gap-2">
                      {Array.from({ length: seats }).map((_, seatIdx) => {
                        const seatNumber = startNumber + seatIdx + 1;
                        const seatCode = `${rowLetter}${seatNumber}`;
                        const seatClass = seatColor[seatType] || 'bg-gray-500';
                        const isSelected = selectedSeats.some(seat => seat.seatCode === seatCode);
                        const seatClassName = isSelected ? 'bg-green-500' : seatClass;

                        return (
                          <button key={seatCode} id={seatCode} className={`p-4 w-8 flex justify-center items-center text-white text-sm ${isSelected ? 'bg-yellow-600' : seatClassName} cursor-pointer hover:bg-amber-500`} onClick={() => handleSeatClick(seatCode, seatType)}>
                            {rowLetter}{seatNumber}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}

                {/* Row Letter on the left */}
                <div className="absolute top-3 left-0 font-bold">{rowLetter}</div>
              </div>
            );
          })}
        </div>
        <div className="w-full h-1 bg-gray-300"></div>
        {selectedSeats.length > 0 && ( <div className="w-full flex flex-col items-start gap-4">
          <h3 className='font-bold text-2xl'>{translations.selectedSeats[lang]}</h3>
          {Object.entries(seatPrices.tickets || {}).map(([seatType, count]) => (
            <div key={seatType} className="flex justify-between w-full">
              <span>{lang === 'ar' ? seatTypeDetails[seatType]?.nameAR || seatType : seatTypeDetails[seatType]?.nameEN || seatType} x {count}</span>
              <span>{lang === 'ar' ?  (seatTypeDetails[seatType]?.price || 0) * count + ' جنيه'|| 0 : (seatTypeDetails[seatType]?.price || 0) * count + ' EGP'}</span>
            </div>
          ))}
          <div className="flex justify-between w-full font-bold text-lg">
            <span>{translations.total[lang]}:</span>
            <span>{lang === 'ar' ?  seatPrices.total + ' جنيه'|| 0 : seatPrices.total + ' EGP'}</span>
          </div>
        </div>)}
        {selectedSeats.length > 0 && ( <button className="bg-tertiary w-full text-white px-4 py-2 rounded hover:bg-primary-dark hover:cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out" onClick={startBook}>
          {translations.procedeToPayment[lang]}
        </button>)}
      </div>
    </div>
  );
}