import React from 'react';
import styles from './MovieCover.module.css';
import { Link } from 'react-router-dom';
import translations from '../../lang/main.json';
import { useLanguage } from '../../contexts/LanguageContext';


/*
  Movie Param:
  {
    "titleEn": "Spider-Man: Brand New Day",
    "titleAr": "سبايدر مان: يوم جديد",
    "poster": "https://assets.voxcinemas.com/posters/P_HO00013065_1782227665332.jpg",
    "ageRating": "12+",
    "language": "en",
    "isBookable": true
  }


 */



export default function MovieCover({ titleEn, titleAr, poster, ageRating, language, isBookable }) {
  const FLAG_EN = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ec-1f1e7.svg"; // 🇬🇧
  const FLAG_AR = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ea-1f1ec.svg"; // 🇪🇬
  const FLAG_FR = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1eb-1f1f7.svg"; // 🇫🇷
  const FLAG_ES = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ea-1f1f8.svg"; // 🇪🇸
  const FLAG_DE = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1e9-1f1ea.svg"; // 🇩🇪
  const FLAG_CN = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1e8-1f1f3.svg"; // 🇨🇳
  const FLAG_JP = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ef-1f1f5.svg"; // 🇯🇵
  const FLAG_KR = "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1f0-1f1f7.svg"; // 🇰🇷
  const { lang, setLang, isRTL } = useLanguage();
  return (
    <Link to="/" className="flex flex-col justify-center gap-4">
      <div className="w-full h-1/2 md:h-3/4 lg:h-auto relative">
        <img src={poster} alt="" className="w-full h-full object-contain" />
        <div className="absolute w-12 h-12 rounded-full bg-tertiary border border-white top-2 right-2 flex justify-center items-center">
          <span className="text-white font-bold">{ageRating}</span>
        </div>
      </div>
      <div>
        <h3 className="text-lg font-bold">{[titleEn, titleAr][lang === 'ar' ? 1 : 0]}</h3>
        <h4 className="text-sm font-semibold flex items-center gap-2"> {translations.language[lang]}: <img src={language === 'en' ? FLAG_EN : language === 'ar' ? FLAG_AR : language === 'fr' ? FLAG_FR : language === 'es' ? FLAG_ES : language === 'de' ? FLAG_DE : language === 'cn' ? FLAG_CN : language === 'jp' ? FLAG_JP : language === 'kr' ? FLAG_KR : FLAG_EN} alt="English" className="w-6 h-6 block" /></h4>
      </div>
      {console.log(isBookable)}
      {isBookable ? <div className={isBookable ? "w-full bg-tertiary py-2 rounded-md font-bold text-white flex justify-center items-center cursor-pointer hover:bg-tertiary/80 transition-all duration-300" : "w-full bg-tertiary py-2 rounded-md font-bold text-white flex justify-center items-center cursor-not-allowed"}>
        <p>{translations.bookNow[lang]}</p>
      </div> : <></>}
    </Link>
  );
}