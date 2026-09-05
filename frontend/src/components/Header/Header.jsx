import React, { useState } from 'react';
import styles from './Header.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faGlobe, faMoon, faSun, faFilm, faLocationDot, faUserAlt, faBowlFood, faHeadset, faBars} from '@fortawesome/free-solid-svg-icons';

export default function Header() {

  const [theme, setTheme] = useState(0) // 0 for dark, 1 for light
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="w-full lg:h-12.5 bg-secondary flex flex-col lg:flex-row lg:gap-0 items-center justify-between px-4 lg:px-16 text-white font-bold">
      <div className='flex flex-row items-center justify-between gap-2 w-full h-full lg:w-auto'>
        <Link to="/"><h1 className="uppercase lg:text-xl">Kanma Cinemas</h1></Link>
        <button className='flex items-center gap-0.5 justify-center flex-nowrap p-2 cursor-pointer lg:hidden' onClick={() => setMenuOpen(!menuOpen)}>
          <FontAwesomeIcon icon={faBars}></FontAwesomeIcon>
        </button>
      </div>
<div className={`flex flex-col lg:flex-row w-full lg:w-auto justify-center items-center gap-4 lg:gap-8 transition-all duration-500 ease-in-out lg:max-h-none lg:overflow-visible ${menuOpen ? 'max-h-250 overflow-hidden' : 'max-h-0 overflow-hidden'}`}>
        <button className='flex items-center gap-0.5 justify-center flex-nowrap p-2 cursor-pointer' onClick={() => setTheme(theme === 0 ? 1 : 0)}>
          <FontAwesomeIcon icon={(theme === 0 ? faMoon : faSun)}></FontAwesomeIcon>
          <h3 className='text-xl'>{theme === 0 ? 'DK' : 'LT'}</h3>
        </button>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faGlobe}></FontAwesomeIcon>
          <h3 className='text-xl'>EN</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faFilm}></FontAwesomeIcon>
          <h3 className='text-xl'>Movies</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faLocationDot}></FontAwesomeIcon>
          <h3 className='text-xl'>Cinemas</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faBowlFood}></FontAwesomeIcon>
          <h3 className='text-xl'>Snacks</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faHeadset}></FontAwesomeIcon>
          <h3 className='text-xl'>Support</h3>
        </Link>
        <Link to="/" className='flex items-center gap-0.5 justify-center flex-nowrap p-2'>
          <FontAwesomeIcon icon={faUserAlt}></FontAwesomeIcon>
          <h3 className='text-xl'>Account</h3>
        </Link>
      </div>
    </nav>
  );
}