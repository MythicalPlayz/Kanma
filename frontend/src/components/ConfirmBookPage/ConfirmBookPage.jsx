import React, { useEffect, useState } from 'react';
import styles from './ConfirmBookPage.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAccountContext } from '../../contexts/AccountContext';
import translations from '../../lang/main.json';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';

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
  const [cardError, setCardError] = useState(0);
  const [payCode, setPayCode] = useState(null);

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
      setServerPublicKey(data.publicKey);
      const response2 = await fetch('http://localhost:4000/bank/public-key');
      const data2 = await response2.json();
      setBankPublicKey(data2.publicKey);
      console.log('Fetched public keys:', data.publicKey, data2.publicKey);
    } catch (error) {
      console.error('Error fetching public keys:', error);
    }
  };

  const encryptDataWithKey = async (data, key) => {
    // 1. Generate AES-256-GCM key
    const symmetricKey = await window.crypto.subtle.generateKey(
      {
        name: "AES-GCM",
        length: 256,
      },
      true,
      ["encrypt", "decrypt"]
    );

    const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bit IV
    const encodedData = new TextEncoder().encode(JSON.stringify(data));

    // 2. Encrypt data (Web Crypto automatically appends the 16-byte auth tag to this buffer)
    const encryptedDataBuffer = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      symmetricKey,
      encodedData
    );

    // 3. Extract the ciphertext and the auth tag properly
    // The last 16 bytes of the buffer are the auth tag
    const encryptedBytes = new Uint8Array(encryptedDataBuffer);
    const ciphertext = encryptedBytes.slice(0, encryptedBytes.length - 16);
    const authTag = encryptedBytes.slice(encryptedBytes.length - 16);

    // 4. Export and encrypt the symmetric key with the RSA Public Key
    const rawSymmetricKey = await window.crypto.subtle.exportKey("raw", symmetricKey);

    const cryptoKey = await window.crypto.subtle.importKey(
      "jwk",
      key,
      { name: "RSA-OAEP", hash: "SHA-256" },
      false,
      ["encrypt"]
    );

    const encryptedSymmetricKeyBuffer = await window.crypto.subtle.encrypt(
      { name: "RSA-OAEP" },
      cryptoKey,
      rawSymmetricKey
    );

    // Helper function to safely convert Uint8Array to base64 (avoids call stack size limits for large payloads)
    const bufferToBase64 = (buffer) => {
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    };

    return {
      encryptedData: bufferToBase64(ciphertext),
      iv: bufferToBase64(iv),
      authTag: bufferToBase64(authTag),
      key: bufferToBase64(encryptedSymmetricKeyBuffer),
    };
  };

  const startBook = async () => {
    if (selectedSeats.length === 0) {
      console.log('No seats selected, cannot proceed to booking');
      return;
    }
    console.log('Starting booking process with selected seats:', selectedSeats);

    const bookingData = {
      showtimeId: showtimeId,
      seats: selectedSeats,
      raw: false
    };

    const encryptedBookingData = await encryptDataWithKey(bookingData, serverPublicKey);

    console.log('Encrypted booking data:', encryptedBookingData);


    // Send booking data to the backend to create a pending booking
    try {
      const response = await fetch('http://localhost:4000/api/bookings/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ encryptedData: encryptedBookingData })
      });
      const data = await response.json();
      if (data.error) {
        console.error('Error creating booking:', data.error);
        return;
      }
      console.log('Booking created successfully:', data);
      // Move to the next step (Payment)
      setSteps(2);
      setPayCode(data.userPayCode); // Store the payCode for later use in payment
    }
    catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  // 3. Luhn Algorithm for Card Number Verification
  const validateLuhn = (digits) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // 4. Expiry Date Check (Current year is 2026)
  const validateExpiry = (month, year) => {
    const m = parseInt(month, 10);
    const y = parseInt("20" + year, 10); // Converts YY to 20YY
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (m < 1 || m > 12) return false;
    if (y < currentYear) return false;
    if (y === currentYear && m < currentMonth) return false;
    return true;
  };

  const handleInput = (e) => {
    const target = e.target;
    const maxLength = parseInt(target.getAttribute("maxlength"), 10);

    // 1) Ensure input is numbers only
    target.value = target.value.replace(/\D/g, '');

    // 2) Auto-focus to the next input when current part is complete
    if (target.value.length >= maxLength) {
      const form = target.form;
      const index = Array.prototype.indexOf.call(form, target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }
    }

    // 3) Check Card Number (Luhn) once all 4 blocks are filled
    const num0 = document.getElementById('num0').value;
    const num1 = document.getElementById('num1').value;
    const num2 = document.getElementById('num2').value;
    const num3 = document.getElementById('num3').value;

    if (num0.length === 4 && num1.length === 4 && num2.length === 4 && num3.length === 4) {
      const fullCardNumber = num0 + num1 + num2 + num3;
      if (!validateLuhn(fullCardNumber)) {
        setCardError(1);
      } else {
        setCardError(0); // Clear error if valid
      }
    }

    // 4) Check Expiry Date once both MM and YY are filled
    const expMonth = document.getElementById('expMonth').value;
    const expYear = document.getElementById('expYear').value;

    if (expMonth.length === 2 && expYear.length === 2) {
      if (!validateExpiry(expMonth, expYear)) {
        setCardError(2);
      } else {
        setCardError(0);
      }
    }

    // 5) Check CVV (must be 3 numbers)
    const cvv = document.getElementById('cvv').value;
    if (cvv.length === 3) {
      // Optional immediate check or wait for submit
      // If you want to flag it instantly if incomplete, handle accordingly
    }
  };

  // Form submission guard (optional final validation check)
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    const cvv = document.getElementById('cvv').value;
    if (cvv.length !== 3) {
      setCardError(3);
      return;
    }
    if (cardError !== 0) {
      console.log('Cannot submit, card details are invalid');
      return;
    }


    // Get the form data
    const card = {
      digits: document.getElementById('num0').value + document.getElementById('num1').value + document.getElementById('num2').value + document.getElementById('num3').value,
      expirationMonth: document.getElementById('expMonth').value,
      expirationYear: document.getElementById('expYear').value,
      cvv: document.getElementById('cvv').value,
    };

    // check that all info is correct
    if (card.digits.length !== 16 || !validateLuhn(card.digits)) {
      setCardError(1);
      return;
    }
    if (!validateExpiry(card.expirationMonth, card.expirationYear)) {
      setCardError(2);
      return;
    }
    if (card.cvv.length !== 3) {
      setCardError(3);
      return;
    }

    const paymentData = {
      card: card,
      payCode: payCode
    };

    // Encrypt the card data with the bank's public key
    const encryptPaymentData = await encryptDataWithKey(paymentData, bankPublicKey);
    console.log('Encrypted payment data:', encryptPaymentData);


    // now we can post
    setLoading(true);
    setError(false);
    const response = await fetch('http://localhost:4000/bank/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ encryptedData: encryptPaymentData })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Payment failed:', errorData);
      setError(true);
      setLoading(false);
      return;
    }

    if (response.ok) {
      if (response.status === 200) {
        const data = await response.json();
        console.log('Payment successful:', data);
        setSteps(4); // Move to confirmation step
      }
      else if (response.status === 201) {
        const data = await response.json();
        console.log('Payment requires OTP:', data);
        setSteps(3); // Move to OTP step
      }
      setLoading(false);
    }
  };

  // 1 = Booking Details, 2 = Payment, 3 = OTP, 4 = Confirmation
  return (
    <div className="w-5-6 lg:w-3-4 mx-auto min-h-screen flex flex-col items-center justify-start p-8 my-8 gap-8">
      {loading && <LoadingElement />}
      {error && <ErrorElement />}
      <h2 className="text-2xl font-bold">{translations.steps[lang].replace('#STEP', steps)}</h2>
      {steps === 1 && screenDetails && (<div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-8 bg-secondary p-8 rounded-lg shadow-lg">
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
        {selectedSeats.length > 0 && (<div className="w-full flex flex-col items-start gap-4">
          <h3 className='font-bold text-2xl'>{translations.selectedSeats[lang]}</h3>
          {Object.entries(seatPrices.tickets || {}).map(([seatType, count]) => (
            <div key={seatType} className="flex justify-between w-full">
              <span>{lang === 'ar' ? seatTypeDetails[seatType]?.nameAR || seatType : seatTypeDetails[seatType]?.nameEN || seatType} x {count}</span>
              <span>{lang === 'ar' ? (seatTypeDetails[seatType]?.price || 0) * count + ' جنيه' || 0 : (seatTypeDetails[seatType]?.price || 0) * count + ' EGP'}</span>
            </div>
          ))}
          <div className="flex justify-between w-full font-bold text-lg">
            <span>{translations.total[lang]}:</span>
            <span>{lang === 'ar' ? seatPrices.total + ' جنيه' || 0 : seatPrices.total + ' EGP'}</span>
          </div>
        </div>)}
        {selectedSeats.length > 0 && (<button className="bg-tertiary w-full text-white px-4 py-2 rounded hover:bg-primary-dark hover:cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out" onClick={startBook}>
          {translations.procedeToPayment[lang]}
        </button>)}
      </div>)}
      {steps === 2 && screenDetails && (<div className="w-full lg:w-1/2 flex flex-col items-center justify-center gap-8 bg-secondary p-8 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold">{translations.payment[lang]}</h2>
        <div className="w-full h-1 bg-gray-300"></div>
        <form id="paymentForm" onSubmit={handlePaymentSubmit} className="w-full flex flex-col items-start justify-center gap-4 px-4">
          <h4>Card Number</h4>
          {cardError == 1 && <p className="text-red-500">Card number is invalid</p>}
          <div className="w-full grid grid-cols-4 gap-2">
            <input onInput={handleInput} id='num0' type="text" placeholder="1234" maxLength={4} minLength={4} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
            <input onInput={handleInput} id='num1' type="text" placeholder="5678" maxLength={4} minLength={4} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
            <input onInput={handleInput} id='num2' type="text" placeholder="9012" maxLength={4} minLength={4} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
            <input onInput={handleInput} id='num3' type="text" placeholder="3456" maxLength={4} minLength={4} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
          </div>
          <h4>Expiry Date (MM/YY)</h4>
          {cardError == 2 && <p className="text-red-500">Expiry date is invalid</p>}
          <div className="w-full grid grid-cols-2 gap-2">
            <input onInput={handleInput} id='expMonth' type="text" placeholder="MM" maxLength={2} minLength={2} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
            <input onInput={handleInput} id='expYear' type="text" placeholder="YY" maxLength={2} minLength={2} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
          </div>
          <h4>CVV</h4>
          {cardError == 3 && <p className="text-red-500">CVV is invalid</p>}
          <input onInput={handleInput} id='cvv' type="text" placeholder="123" maxLength={3} minLength={3} className="bg-gray-200 text-gray-700 placeholder:text-gray-500 border border-gray-300 rounded py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" />
          <button type="submit" disabled={cardError !== 0} className="bg-tertiary w-full text-white px-4 py-2 rounded hover:bg-primary-dark hover:cursor-pointer hover:scale-110 transition-all duration-500 ease-in-out">
            {translations.payNow[lang]}
          </button>
        </form>
      </div>)}
    </div>);
}