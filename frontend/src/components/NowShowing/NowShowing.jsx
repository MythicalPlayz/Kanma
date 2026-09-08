import React from 'react';
import styles from './NowShowing.module.css';
import MovieCover from '../MovieCover/MovieCover';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function NowShowing() {
  const { lang, setLang, isRTL } = useLanguage();
  return (
    <div className=" flex flex-col justify-center gap-8 my-4 px-8">
      <h2 className="text-3xl font-bold uppercase mx-auto flex items-center gap-2 lg:mx-0">{<FontAwesomeIcon icon={faFilm} />} {translations.nowShowing[lang]}</h2>
      <div className=" flex flex-col lg:flex-row justify-center gap-8 items-center">
        <select name="Cinema" id="cinema" className="bg-tertiary p-4 rounded-md font-bold text-white" placeholder="{translations.selectCinema[lang]}">
          <option value="">{translations.selectCinema[lang]}</option>
          <option value="cinema1">Cinema 1</option>
          <option value="cinema2">Cinema 2</option>
          <option value="cinema3">Cinema 3</option>
        </select>
        <select name="Time" id="time" className="bg-tertiary p-4 rounded-md font-bold text-white" placeholder="{translations.selectTime[lang]}">
          <option value="">{translations.selectTime[lang]}</option>
          <option value="time1">Time 1</option>
          <option value="time2">Time 2</option>
          <option value="time3">Time 3</option>
        </select>
      </div>
      <div className="w-full md:w-5/6 lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-start-row items-start mx-auto">
        <MovieCover titleEn="Spider-Man: Brand New Day" titleAr="سبايدر مان: يوم جديد" poster="https://assets.voxcinemas.com/posters/P_HO00013065_1782227665332.jpg" ageRating="12+" language="en" isBookable={true}></MovieCover>
        <MovieCover titleEn="Mahmoud El Tany" titleAr="محمود التاني" poster="https://assets.voxcinemas.com/posters/P_HO00013538_1786431574055.jpg" ageRating="12+" language="ar" isBookable={true}></MovieCover>
        <MovieCover titleEn="Detective Conan 29" titleAr="المحقق كونان 29" poster="https://assets.voxcinemas.com/posters/P_HO00013505_1783599648053.jpg" ageRating="12+" language="jp" isBookable={true}></MovieCover>
        <MovieCover titleEn="Hexed" titleAr="هكسد" poster="https://assets.voxcinemas.com/posters/P_HO00013335_1782228087065.jpg" ageRating="G" language="en" isBookable={true}></MovieCover>
      </div>
      <div className="w-full flex justify-center items-center">
        <button className="bg-tertiary p-4 rounded-md font-bold text-white hover:cursor-pointer hover:bg-tertiary/80 transition-all duration-300">
          {translations.loadMore[lang]}
        </button>
      </div>
    </div>
  );
}