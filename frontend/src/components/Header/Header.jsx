import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faMoon, faSun, faFilm, faLocationDot, faUserAlt, faBowlFood, faHeadset, faBars } from '@fortawesome/free-solid-svg-icons';
import translations from '../../lang/main.json';

export default function Header() {

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved !== null ? Number(saved) : 0;
  });
  const [menuOpen, setMenuOpen] = useState(false)

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    if (darkMode === 0) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', '0');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', '1');
    }
  }, [darkMode]);

  return (
    <nav className="w-full lg:h-12.5 bg-secondary flex flex-col lg:flex-row lg:gap-0 items-center justify-between px-4 lg:px-16 text-white font-bold">
      <div className='flex flex-row items-center justify-between gap-2 w-full h-full lg:w-auto'>
        <Link to="/"><h1 className="uppercase lg:text-xl">{translations.mainName[lang]}</h1></Link>
        <button className='flex items-center gap-0.5 justify-center flex-nowrap p-2 cursor-pointer lg:hidden' onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
        </button>
      </div>
      <div className={`flex flex-col lg:flex-row w-full lg:w-auto justify-center items-center gap-4 lg:gap-8 transition-all duration-500 ease-in-out lg:max-h-none lg:overflow-visible ${menuOpen ? 'max-h-250 overflow-hidden' : 'max-h-0 overflow-hidden'}`}>
        <button className='flex items-center gap-0.5 justify-center flex-nowrap p-2 cursor-pointer' onClick={() => setDarkMode(darkMode === 0 ? 1 : 0)}>
          <FontAwesomeIcon icon={(darkMode === 0 ? faMoon : faSun)}></FontAwesomeIcon>
          <h3 className='text-xl'>{darkMode === 0 ? translations.darkMode[lang] : translations.lightMode[lang]}</h3>
        </button>
        <button className='flex items-center gap-0.5 justify-center flex-nowrap p-2 cursor-pointer' onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
          <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>
          <h3 className='text-xl'>{lang === 'en' ? 'EN' : 'AR'}</h3>
        </button>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faFilm}></FontAwesomeIcon>
          <h3 className='text-xl'>{translations.movies[lang]}</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
          <h3 className='text-xl'>{translations.cinemas[lang]}</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faBowlFood}></FontAwesomeIcon>
          <h3 className='text-xl'>{translations.snacks[lang]}</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faHeadset}></FontAwesomeIcon>
          <h3 className='text-xl'>{translations.support[lang]}</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon>
          <h3 className='text-xl'>{translations.account[lang]}</h3>
        </Link>
      </div>
    </nav>
  );
}