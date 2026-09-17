import React from 'react';
import styles from './SupportPageContact.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
export default function SupportPageContact() {
  const { lang } = useLanguage();
  return (
    <div className="w-full h-full flex flex-col items-start justify-start gap-4">
      <h2 className="text-4xl font-bold text-center relative mb-4">{translations.contactUs[lang]}
        <div className="absolute -bottom-2.5 left-0 right-0 transform w-full lg:w-3/4 mx-auto lg:mx-0 h-1 bg-secondary" />
      </h2>
      <div className="w-full flex flex-col items-start justify-start gap-4">
        <Link to="mailto:contact@kanma-cinemas.com" className='flex flex-row gap-4 justify-center items-center'>
          <FontAwesomeIcon icon={faEnvelope} className="text-xl" />
          <p className="text-lg">contact@kanma-cinemas.com</p>
        </Link>
        <Link to="tel:55555" className='flex flex-row gap-4 justify-center items-center'>
          <FontAwesomeIcon icon={faPhone} className="text-xl" />
          <p className="text-lg">55555</p>
        </Link>
        <Link to="tel:+201012345678" className='flex flex-row gap-4 justify-center items-center'>
          <FontAwesomeIcon icon={faPhone} className="text-xl" />
          <p className="text-lg">+20 101 234 5678</p>
        </Link>
      </div>
      <Link to="/support" className="bg-tertiary text-white py-2 px-4 rounded-md hover:bg-secondary transition-all duration-300">{translations.goback[lang]}</Link>
    </div>
  );
}