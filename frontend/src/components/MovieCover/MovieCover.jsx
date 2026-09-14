import React from 'react';
import styles from './MovieCover.module.css';
import { Link } from 'react-router-dom';
import translations from '../../lang/main.json';
import { useLanguage } from '../../contexts/LanguageContext';

const FLAGS = {
  en: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ec-1f1e7.svg",
  ar: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ea-1f1ec.svg",
  fr: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1eb-1f1f7.svg",
  es: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ea-1f1f8.svg",
  de: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1e9-1f1ea.svg",
  cn: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1e8-1f1f3.svg",
  jp: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1ef-1f1f5.svg",
  kr: "https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/1f1f0-1f1f7.svg",
};

export default function MovieCover({ titleEn, titleAr, poster, ageRating, language, isBookable }) {
  const { lang } = useLanguage();
  const currentTitle = lang === 'ar' ? titleAr : titleEn;
  const flagSrc = FLAGS[language] || FLAGS.en;

  return (
    <Link to="/movie/1" className="flex flex-col h-full shadow-2xl rounded-xl p-2 hover:cursor-pointer hover:scale-105 transition-all duration-300">
      <div className="relative w-full aspect-2/3 overflow-hidden rounded-lg">
        <img src={poster} alt={currentTitle} className="w-full h-full object-cover" />
        <div className="absolute w-10 h-10 rounded-full bg-tertiary border border-white top-2 right-2 flex justify-center items-center shadow">
          <span className="text-white text-xs font-bold">{ageRating}</span>
        </div>
      </div>

      <div className="flex flex-col justify-between grow pt-3 px-1 gap-3">
        <h3 className="text-lg font-bold leading-snug">
          {currentTitle}
        </h3>

        <div className="flex flex-col gap-3 mt-auto">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            {translations.language[lang]}:
            <img src={flagSrc} alt={language} className="w-5 h-5 block" />
          </h4>

          {isBookable && (
            <div className="w-full bg-tertiary py-2 rounded-md font-bold text-white flex justify-center items-center hover:bg-tertiary/80 transition-all duration-300">
              <p>{translations.bookNow[lang]}</p>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}