import React, { useEffect, useState } from 'react';
import styles from './LoginComponent.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { getAccountContext } from '../../contexts/AccountContext';
import { useNavigate, useOutlet } from 'react-router-dom';

export default function LoginComponent() {
  const { lang } = useLanguage();
  var { accessToken, setAccessToken } = getAccountContext();
  const [loading, setLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const NavigateTo = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setLoading(true);
    setShowError(false);
    setErrorMessage(null);
    handleLogin(email, password);
  }

  const handleLogin = async (email, password) => {
    try {
      const response = await fetch('http://localhost:4000/api/account/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const isOk = response.ok;
      const data = await response.json();
      if (!isOk) {
        throw new Error([data.message, data.token] || 'Login failed');
      }

      
      console.log(data);
      setAccessToken(data.token);
      localStorage.setItem('accountToken', data.token);
      NavigateTo('/account/profile');
    } catch (error) {
      error = error.message.split(',');
      console.error('Error during login:', error[0]);
      if (error[0].includes('unverified')) {
        const token = error[1];
        setAccessToken(token);
        localStorage.setItem('accountToken', token);
        NavigateTo('/account/verify');
        return;
      }
      setShowError(true);
      setErrorMessage(error[0]);
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
      <h3 className="text-3xl font-bold">{translations.loginPage[lang]}</h3>
      <div className='bg-secondary p-12 rounded-2xl w-5/6 md:w-3/4 lg:w-1/2 flex flex-col justify-start items-start gap-4'>
        <form action="" onSubmit={handleSubmit} className='w-full flex flex-col justify-start items-start gap-4'>
          {showError && <div className='bg-red-500 text-white p-4 rounded-md w-full flex justify-start items-center gap-4'>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>{errorMessage}</span>
          </div>}
          <h4 className="text-lg font-semibold text-white">{translations.email[lang]}</h4>
          <input id="email" type="email" placeholder={"example@example.com"} className='w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary' />
          <h4 className="text-lg font-semibold text-white">{translations.password[lang]}</h4>
          <input id="password" type="password" placeholder={"••••••••"} className='w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary' />
          <button type="submit" className='bg-tertiary text-white p-2 rounded-md w-full hover:bg-primary/80 transition-all duration-300 disabled:bg-primary/80'>{translations.login[lang]}</button>
        </form>
      </div>
      <div className='flex justify-center items-center gap-4 flex-col'>
        <Link to="/account/register">{translations.noAccount[lang]}</Link>
        <Link to="/account/forgot-password">{translations.forgotPassword[lang]}</Link>
      </div>
    </div>
  );
}