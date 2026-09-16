import React from 'react';
import styles from './MoviesPage.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard, faTicket } from '@fortawesome/free-solid-svg-icons';
import translations from '../../lang/main.json';
import { useLanguage } from '../../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export default function MoviesPage() {
  const { lang } = useLanguage();

  return (
    <div className="mx-auto w-5/6 lg:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-8 my-4 min-h-screen">
      <Link to="/movies/now-showing" className="w-full h-75 rounded-3xl bg-tertiary p-16 relative flex justify-center items-center">
        <h2 className="text-5xl font-bold uppercase mb-4">{translations.nowShowing[lang]}</h2>
        <div className='absolute top-0 left-0 bottom-0 right-0 opacity-50 flex justify-center items-center'>
          <FontAwesomeIcon icon={faTicket} className="text-9xl rotate-12 text-quaternary scale-200"></FontAwesomeIcon>
        </div>
      </Link>
      <Link to="/movies/coming-soon" className="w-full h-75 rounded-3xl bg-tertiary p-16 relative flex justify-center items-center">
        <h2 className="text-5xl font-bold uppercase mb-4">{translations.comingSoon[lang]}</h2>
        <div className='absolute top-0 left-0 bottom-0 right-0 opacity-50 flex justify-center items-center'>
          <FontAwesomeIcon icon={faClapperboard} className="text-9xl rotate-12 text-quaternary scale-200"></FontAwesomeIcon>
        </div>
      </Link>
    </div>
  );
}