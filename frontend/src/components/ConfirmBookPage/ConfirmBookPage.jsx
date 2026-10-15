import React, { useEffect, useState } from 'react';
import styles from './ConfirmBookPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAccountContext } from '../../contexts/AccountContext';

export default function ConfirmBookPage() {
  const { showtimeId } = useParams();
  const [steps, setSteps] = useState(1);
  const [screenDetails, setScreenDetails] = useState(null);
  const { lang } = useLanguage();
  const { accessToken } = getAccountContext();
  const navigateTo = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
      setScreenDetails(data);
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

  useEffect(() => {
    fetchScreenDetails(showtimeId);
  }, [showtimeId]);


  // 1 = Booking Details, 2 = Payment, 3 = OTP, 4 = Confirmation
  return (
    <div className="w-5-6 lg:w-3-4 mx-auto min-h-screen flex flex-col items-center justify-start p-8 my-8">
      <h1>ConfirmBookPage booking: {showtimeId}</h1>
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-8 bg-secondary p-8 rounded-lg shadow-lg">
        <h2>Select Seats</h2>
        <div className="w-full flex flex-col items-center justify-center gap-4">
          <div className="flex bg-black w-full h-8 justify-center items-center">
            <span className="text-white text-sm">Screen</span>
          </div>
          {screenDetails && screenDetails.seatLayout.map((row, rowIndex) => {
            const rowLetter = String.fromCharCode(65 + rowIndex);

            return (
              <div key={rowIndex} className="flex gap-8 w-full mx-auto justify-center relative">
                {row.row.map((seats, blockIndex) => {
                  // Calculate the starting seat number by adding all seats before this section
                  const startNumber = row.row
                    .slice(0, blockIndex)
                    .reduce((sum, count) => sum + count, 0);

                  return (
                    <div key={blockIndex} className="flex gap-2">
                      {Array.from({ length: seats }).map((_, seatIdx) => {
                        const seatNumber = startNumber + seatIdx + 1;
                        const seatCode = `${rowLetter}${seatNumber}`;

                        return (
                          <div key={seatCode} id={seatCode} className="p-4 w-8 flex justify-center items-center text-white text-sm bg-gray-500 cursor-pointer hover:bg-amber-500">
                            {rowLetter}{seatNumber}
                          </div>
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
      </div>
    </div>
  );
}