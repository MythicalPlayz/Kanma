import React from 'react';
import styles from './ComingSoon.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import MovieCover from '../MovieCover/MovieCover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';

export default function ComingSoon() {
  const { lang, setLang, isRTL } = useLanguage();
   return (
    <div className=" flex flex-col justify-center gap-8 my-4 px-8">
      <h2 className="text-3xl font-bold uppercase mx-auto flex items-center gap-2 lg:mx-0">{<FontAwesomeIcon icon={faFilm} />} {translations.comingSoon[lang]}</h2>
      <div className="w-full md:w-5/6 lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-start-row items-start mx-auto">
        <MovieCover titleEn="Spider-Man: Brand New Day" titleAr="سبايدر مان: يوم جديد" poster="https://assets.voxcinemas.com/posters/P_HO00013065_1782227665332.jpg" ageRating="NR" language="en" isBookable={false}></MovieCover>
        <MovieCover titleEn="Mahmoud El Tany" titleAr="محمود التاني" poster="https://assets.voxcinemas.com/posters/P_HO00013538_1786431574055.jpg" ageRating="NR" language="ar" isBookable={false}></MovieCover>
        <MovieCover titleEn="Detective Conan 29" titleAr="المحقق كونان 29" poster="https://assets.voxcinemas.com/posters/P_HO00013505_1783599648053.jpg" ageRating="NR" language="jp" isBookable={false}></MovieCover>
        <MovieCover titleEn="Hexed" titleAr="هكسد" poster="https://assets.voxcinemas.com/posters/P_HO00013335_1782228087065.jpg" ageRating="NR" language="en" isBookable={false}></MovieCover>
      </div>
      <div className="w-full flex justify-center items-center">
        <button className="bg-tertiary p-4 rounded-md font-bold text-white hover:cursor-pointer hover:bg-tertiary/80 transition-all duration-300">
          {translations.loadMore[lang]}
        </button>
      </div>
    </div>
  );
}