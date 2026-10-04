import React, { useEffect, useState } from 'react';
import styles from './RegisterComponent.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { getAccountContext } from '../../contexts/AccountContext';
import { useNavigate, useOutlet } from 'react-router-dom';

export default function RegisterComponent() {
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
    const FName = e.target.firstName.value;
    const LName = e.target.lastName.value;
    const telephone = e.target.telephone.value;
    setLoading(true);
    setShowError(false);
    setErrorMessage(null);
    handleRegister(email, password, FName, LName, telephone);
  }

  const handleRegister = async (email, password, FName, LName, telephone) => {
    try {
      const response = await fetch('http://localhost:4000/api/account/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, FName, LName, telephone }),
      });

      const isOk = response.ok;
      const data = await response.json();
      if (!isOk) {
        throw new Error(data.message || 'Register failed');
      }


      console.log(data);
      setAccessToken(data.token);
      localStorage.setItem('accountToken', data.token);
      NavigateTo('/account/verify');
    } catch (error) {
      console.error('Error during register:', error);
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
      <h3 className="text-3xl font-bold">{translations.registerPage[lang]}</h3>
      <div className='bg-secondary p-12 rounded-2xl w-5/6 md:w-3/4 lg:w-1/2 flex flex-col justify-start items-start gap-4'>
        <form action="" onSubmit={handleSubmit} className='w-full flex flex-col justify-start items-start gap-4'>
          {showError && <div className='bg-red-500 text-white p-4 rounded-md w-full flex justify-start items-center gap-4'>
            <FontAwesomeIcon icon={faTriangleExclamation} />
            <span>{errorMessage}</span>
          </div>}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4 w-full'>
            <h4 className="text-lg font-semibold text-white">{translations.FName[lang]}</h4>
            <h4 className="text-lg font-semibold text-white">{translations.LName[lang]}</h4>
            <input id="firstName" type="text" placeholder={"John"} className='w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary' />
            <input id="lastName" type="text" placeholder={"Doe"} className='w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary' />
          </div>
          <h4 className="text-lg font-semibold text-white">{translations.telephone[lang]}</h4>
          <input id="telephone" type="text" placeholder={"0100 100 1000"} className='w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary' />
          <h4 className="text-lg font-semibold text-white">{translations.email[lang]}</h4>
          <input id="email" type="email" placeholder={"example@example.com"} className='w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary' />
          <h4 className="text-lg font-semibold text-white">{translations.password[lang]}</h4>
          <input id="password" type="password" placeholder={"••••••••"} className='w-full p-2 rounded-md border bg-white  border-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-primary' />
          <button type="submit" className='bg-tertiary text-white p-2 rounded-md w-full hover:bg-primary/80 transition-all duration-300 disabled:bg-primary/80'>{translations.register[lang]}</button>
        </form>
      </div>
      <div className='flex justify-center items-center gap-4 flex-col'>
        <Link to="/account/login">{translations.haveAccount[lang]}</Link>
      </div>
    </div>
  );
}