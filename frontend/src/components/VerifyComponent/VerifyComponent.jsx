import React, { useEffect, useState } from 'react';
import styles from './VerifyComponent.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { getAccountContext } from '../../contexts/AccountContext';
import { useNavigate, useOutlet } from 'react-router-dom';

const numberRegex = /^[0-9]$/;

export default function VerifyComponent() {
  const { lang } = useLanguage();
  var { accessToken, setAccessToken } = getAccountContext();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const NavigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = e.target.d1.value + e.target.d2.value + e.target.d3.value + e.target.d4.value + e.target.d5.value + e.target.d6.value;
    setLoading(true);
    setShowError(false);
    setErrorMessage(null);
    handleVerify(code);
  }

  const numberCheck = (e) => {
    const input = e.target;
    const value = input.value;

    if (!numberRegex.test(value)) {
      input.value = '';
    }
    else {
      const nextInput = input.nextElementSibling;
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  const handleVerify = async (code) => {
    try {
      const response = await fetch('http://localhost:4000/api/account/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ code }),
      });

      const isOk = response.ok;
      const data = await response.json();
      if (!isOk) {
        throw new Error(data.message || 'Verification failed');
      }


      console.log(data);
      setAccessToken(data.token);
      localStorage.setItem('accountToken', data.token);
      NavigateTo('/account/profile');
    } catch (error) {
      console.error('Error during verify:', error);
      setShowError(true);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const button = document.querySelector('button[type="submit"]');
    if (loading) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }, [loading]);

  useEffect(() => {
    if (accessToken === null) {
      console.log('No access token found, redirecting to login page');
      NavigateTo('/account/login');
    }
  }, [accessToken]);

  return (
    <div className="flex flex-col justify-center items-center gap-4 py-8 w-full">
      <h3 className="text-3xl font-bold">{translations.verifyAccount[lang]}</h3>
      <div className='bg-secondary p-12 rounded-2xl w-5/6 md:w-3/4 lg:w-1/2 flex flex-col justify-start items-start gap-4'>
        <form action="" onSubmit={handleSubmit} className='w-full flex flex-col justify-start items-start gap-4'>
          {showError && <div className='bg-red-500 text-white p-4 rounded-md w-full flex justify-start items-center gap-4'>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>{errorMessage}</span>
          </div>}
          
          <p className='text-sm text-white'>{translations.codeEmail[lang]}</p>
          <h4 className="text-2xl w-full text-center font-semibold text-white">{translations.code[lang]}</h4>
          <div className="w-full p-4 flex flex-nowrap justify-center items-center gap-4">
            <input id="d1" type="text" placeholder={"0"} max={9} min={0} maxLength={1} className='w-8 p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center' onChange={numberCheck} />
            <input id="d2" type="text" placeholder={"0"} max={9} min={0} maxLength={1} className='w-8 p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center' onChange={numberCheck} />
            <input id="d3" type="text" placeholder={"0"} max={9} min={0} maxLength={1} className='w-8 p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center' onChange={numberCheck} />
            <input id="d4" type="text" placeholder={"0"} max={9} min={0} maxLength={1} className='w-8 p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center' onChange={numberCheck} />
            <input id="d5" type="text" placeholder={"0"} max={9} min={0} maxLength={1} className='w-8 p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center' onChange={numberCheck} />
            <input id="d6" type="text" placeholder={"0"} max={9} min={0} maxLength={1} className='w-8 p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center' onChange={numberCheck} />
          </div>
          
          <button type="submit" className='bg-tertiary text-white p-2 rounded-md w-full hover:bg-primary/80 transition-all duration-300 disabled:bg-primary/80'>{translations.verify[lang]}</button>
        </form>
      </div>
    </div>
  );
}