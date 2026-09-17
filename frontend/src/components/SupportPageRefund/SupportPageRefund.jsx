import React, { useEffect } from 'react';
import styles from './SupportPageRefund.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import refundTranslationsAr from '../../lang/refundAR.html?raw';
import refundTranslationsEn from '../../lang/refundEN.html?raw';

export default function SupportPageRefund() {

  const { lang } = useLanguage();

  useEffect(() => {
    const selectedLang = lang === 'en' ? refundTranslationsEn : refundTranslationsAr;
    const refundContentDiv = document.getElementById('refund-content');
    if (refundContentDiv) {
      refundContentDiv.innerHTML = selectedLang;
    }
  }, [lang]);

  console.log(refundTranslationsAr);
  return (
    <div className="min-h-screen flex flex-col justify-start items-start gap-4 p-8">
      <h2 className="text-4xl font-bold text-center relative mb-4">{translations.refundPolicy[lang]}
        <div className="absolute -bottom-2.5 left-0 right-0 transform w-full lg:w-3/4 mx-auto lg:mx-0 h-1 bg-secondary" />
      </h2>
      <div className="flex w-full flex-row justify-start items-center gap-4 bg-tertiary p-4 rounded-lg shadow-md">
        <FontAwesomeIcon icon={faClock} />
        <h3>{translations.refundTDLR[lang]}</h3>
      </div>
      <div className="w-full flex flex-col gap-4">
        <div id="refund-content" className="w-full" />
      </div>
       <Link to="/support" className="bg-tertiary text-white py-2 px-4 rounded-md hover:bg-secondary transition-all duration-300">{translations.goback[lang]}</Link>
    </div>
  );
}