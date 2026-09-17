import React from 'react';
import styles from './SupportPage.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link, useOutlet } from 'react-router-dom';
import translations from '../../lang/main.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeadset } from '@fortawesome/free-solid-svg-icons';

export default function SupportPage() {

  const { lang } = useLanguage();
  const outlet = useOutlet();

  return (
    <div className="flex flex-col justify-start items-center gap-4 py-8 min-h-screen">
      <h2 className="text-2xl font-bold"><FontAwesomeIcon icon={faHeadset} /> {translations.howtohelp[lang]}</h2>
      {outlet ? (
        <div className="w-5/6 lg:w-3/4 max-w-7xl">
          {outlet}
        </div>
      ) : (
        <div className="w-5/6 lg:w-3/4 max-w-7xl grid grid-cols-1 gap-4">
          <Link className="bg-secondary text-white p-4 rounded-lg text-center font-bold text-xl shadow-md hover:bg-tertiary hover:scale-105 transition-all duration-300" to="/support/faq">
            {translations.faq[lang]}
          </Link>
          <Link className="bg-secondary text-white p-4 rounded-lg text-center font-bold text-xl shadow-md hover:bg-tertiary hover:scale-105 transition-all duration-300" to="/support/refunds">
            {translations.refundPolicy[lang]}
          </Link>
          <Link className="bg-secondary text-white p-4 rounded-lg text-center font-bold text-xl shadow-md hover:bg-tertiary hover:scale-105 transition-all duration-300" to="/support/contact">
            {translations.contactUs[lang]}
          </Link>
          <Link className="bg-secondary text-white p-4 rounded-lg text-center font-bold text-xl shadow-md hover:bg-tertiary hover:scale-105 transition-all duration-300" to="/support/terms-and-conditions">
            {translations.termsAndConditions[lang]}
          </Link>
          <Link className="bg-secondary text-white p-4 rounded-lg text-center font-bold text-xl shadow-md hover:bg-tertiary hover:scale-105 transition-all duration-300" to="/support/terms-of-use">
            {translations.termsOfUse[lang]}
          </Link>
          <Link className="bg-secondary text-white p-4 rounded-lg text-center font-bold text-xl shadow-md hover:bg-tertiary hover:scale-105 transition-all duration-300" to="/support/privacy-policy">
            {translations.privacyPolicy[lang]}
          </Link>
        </div>
      )}
    </div>
  );
}