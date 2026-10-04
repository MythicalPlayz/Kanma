import React, { useContext, useEffect, useState } from 'react';
import styles from './AccountPage.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAccountContext } from '../../contexts/AccountContext';
import { useNavigate, useOutlet } from 'react-router-dom';
import translations from '../../lang/main.json';

export default function AccountPage() {

  const { lang } = useLanguage();
  const outlet = useOutlet();
  const hasChildRoute = Boolean(outlet);
  const navigateTo = useNavigate();
  const { accessToken } = getAccountContext();

  useEffect(() => {
    // check if context has a token, if not redirect to login page, if yes redirect to account page
    //  the user should not reach this page it must redirect; 

    if (accessToken === null) {
      console.log('No access token found, checking if user is on a unauthorized route...');
      if (location.pathname.includes('/account/profile')) {
        console.log('User is on a protected route without a token, redirecting to login page');
        navigateTo('/account/login');
      }
      else if (location.pathname.endsWith('/account')) {
        console.log('User is on the account page without a token, redirecting to login page');
        navigateTo('/account/login');
      }
    } else {
      console.log('Access token found, redirecting to profile page');
      if (!location.pathname.endsWith('/verify')) {
        checkIfValidToken();
      }
    }
  }, [hasChildRoute, accessToken, navigateTo]);


  const checkIfValidToken = async () => {
    const res = await fetch('http://localhost:4000/api/account/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (res.ok) {
      navigateTo('/account/profile');
    } else {
      navigateTo('/account/login');
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col justify-start items-center gap-4 py-8 min-h-screen">
      <h2 className="text-4xl font-bold">{translations.accountPage[lang]}</h2>
      <div className="w-full flex justify-center items-center">{outlet}</div>
    </div>
  );
}