import React, { useEffect, useState } from 'react';
import styles from './ForgotPassComponent.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { getAccountContext } from '../../contexts/AccountContext';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassComponent() {
  const { lang } = useLanguage();
  var { accessToken, setAccessToken } = getAccountContext();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const NavigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    setLoading(true);
    setShowError(false);
    setErrorMessage(null);
    handleEmailCheck(email);
  }


  const handleEmailCheck = async (email) => {
    console.log('Checking email for password reset:', email);
    try {
      const response = await fetch('http://localhost:4000/api/account/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email }),
      });

      const isOk = response.ok;
      const data = await response.json();
      if (!isOk) {
        throw new Error(data.message || 'Password reset failed');
      }

      // This is a security risk, but for now we will just redirect to the reset password page with the token in the URL
      NavigateTo('/account/reset-password?resetToken=' + data.resetToken);
    } catch (error) {
      console.error('Error during forgot password:', error);
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


  return (
    <div className="flex flex-col justify-center items-center gap-4 py-8 w-full">
      <h3 className="text-3xl font-bold">{translations.forgotPassword[lang]}</h3>
      <div className='bg-secondary p-12 rounded-2xl w-5/6 md:w-3/4 lg:w-1/2 flex flex-col justify-start items-start gap-4'>
        <form action="" onSubmit={handleSubmit} className='w-full flex flex-col justify-start items-start gap-4'>
          {showError && <div className='bg-red-500 text-white p-4 rounded-md w-full flex justify-start items-center gap-4'>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>{errorMessage}</span>
          </div>}

          <p className='text-sm text-white'>{translations.forgotEmail[lang]}</p>
          <h4 className="text-2xl w-full text-center font-semibold text-white">{translations.email[lang]}</h4>
          <div className="w-full p-4 flex flex-nowrap justify-center items-center gap-4">
            <input id="email" type="email" placeholder={"email@example.com"} className=' w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center' />
          </div>

          <button type="submit" className='bg-tertiary text-white p-2 rounded-md w-full hover:bg-primary/80 transition-all duration-300 disabled:bg-primary/80'>{translations.resetPassword[lang]}</button>
        </form>
      </div>
    </div>
  );
}