import React, { useEffect, useState } from 'react';
import styles from './ProfileComponent.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAccountContext } from '../../contexts/AccountContext';
import translations from '../../lang/main.json';
import { useNavigate } from 'react-router-dom';

export default function ProfileComponent() {

  const { accessToken, setAccessToken } = getAccountContext();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigateTo = useNavigate();

  const [account, setAccount] = useState({
    user: {
      FName: '',
      LName: '',
      email: '',
      telephone: ''
    }
  });

  const fetchAccountData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:4000/api/account/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch account data');
      }

      console.log('Fetched account data:', data);
      setAccount(data);
    } catch (error) {
      setError(error.message);
      console.error('Error fetching account data:', error);
      // assume that something is wrong with token
      setAccessToken(null);
      localStorage.removeItem('accountToken');
      navigateTo('/account/login');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    const response = await fetch('http://localhost:4000/api/account/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    setAccessToken(null);
    localStorage.removeItem('accountToken');
    navigateTo('/account/login');
  }

  useEffect(() => {
    if (accessToken === null) {
      console.log('No access token found, redirecting to login page');
      navigateTo('/account/login');
    } else {
      fetchAccountData();
    }
  }, [accessToken]);

  const { lang } = useLanguage();
  return (
    <div className="max-w-7xl lg:w-3/4 w-5/6  mx-auto flex flex-col justify-start items-center gap-4 py-8 min-h-screen">
        <div className="flex flex-col justify-start items-center bg-secondary p-8 gap-8 rounded-md w-full">
            <h2 className="text-3xl font-bold mb-4 w-full text-center">{translations.profile[lang]}</h2>
            <div className="w-full flex flex-row gap-4 justify-between items-center">
              <p className="text-white text-xl">{translations.FName[lang]}</p>
              <p className="text-white text-xl">{account.user.FName}</p>
            </div>
            <div className="w-full flex flex-row gap-4 justify-between items-center">
              <p className="text-white text-xl">{translations.LName[lang]}</p>
              <p className="text-white text-xl">{account.user.LName}</p>
            </div>
            <div className="w-full flex flex-row gap-4 justify-between items-center">
              <p className="text-white text-xl">{translations.email[lang]}</p>
              <p className="text-white text-xl">{account.user.email}</p>
            </div>
            <div className="w-full flex flex-row gap-4 justify-between items-center">
              <p className="text-white text-xl">{translations.telephoneNumber[lang]}</p>
              <p className="text-white text-xl">{account.user.telephone}</p>
            </div>
        </div>
        <button className="text-white bg-red-500 py-2 px-4 rounded-md hover:bg-secondary transition duration-300 w-full" onClick={logout}>
          {translations.logout[lang]}
        </button>
    </div>
  );
}