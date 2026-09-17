import React from 'react';
import styles from './SupportPageItem.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import termsAndConditionsAr from '../../lang/termsAndConditionsAR.txt?raw';
import termsAndConditionsEn from '../../lang/termsAndConditionsEN.txt?raw';
import termsOfUseAr from '../../lang/termsOfUseAR.txt?raw';
import termsOfUseEn from '../../lang/termsOfUseEN.txt?raw';
import privacyPolicyAr from '../../lang/privacyPolicyAR.txt?raw';
import privacyPolicyEn from '../../lang/privacyPolicyEN.txt?raw';
import { Link } from 'react-router-dom';


export default function SupportPageItem({item}) {
  const { lang } = useLanguage();
  console.log(translations[item][lang]);
  var content;

  if (item === 'termsAndConditions') {
    content = lang === 'en' ? termsAndConditionsEn : termsAndConditionsAr;
  } else if (item === 'termsOfUse') {
    content = lang === 'en' ? termsOfUseEn : termsOfUseAr;
  } else if (item === 'privacyPolicy') {
    content = lang === 'en' ? privacyPolicyEn : privacyPolicyAr;
  }


  return (
    <div className="w-full flex flex-col justify-start items-start gap-12">
      <h2 className="text-4xl font-bold text-center relative mb-4">{translations[item][lang]}
        <div className="absolute -bottom-2.5 left-0 right-0 transform w-full lg:w-3/4 mx-auto lg:mx-0 h-1 bg-secondary" />
      </h2>
      <div className="w-full flex flex-col gap-4">
        <div className='whitespace-pre-line' dangerouslySetInnerHTML={{ __html: content }} />
      </div>
      <Link to="/support" className="bg-tertiary text-white py-2 px-4 rounded-md hover:bg-secondary transition-all duration-300">{translations.goback[lang]}</Link>
    </div>
  );
}