import React from 'react';
import styles from './CinemasPage.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { Link } from 'react-router-dom';

const cinemas = [
  {
    nameEN: "Vox Cinemas Mall of Egypt",
    nameAR: "فوكس سينما مول مصر",
    addressEN: "Mall of Egypt, 6th of October City, Giza Governorate, Egypt",
    addressAR: "مول مصر، مدينة 6 أكتوبر، محافظة الجيزة، مصر",
    imageURL: "https://media0106.elcinema.com/uploads/_310x310_9ad5cdee298cc9765c7d87bfa86556533633d9b3fe8f61b1cb43a3f1129ce0dd.jpg",
    googleMapsLink: "https://maps.app.goo.gl/zUfTJu1T1es5HUmR8"
  },
  {
    nameEN: "City Stars Cinema",
    nameAR: "سينما سيتي ستارز",
    addressEN: "City Stars Mall, Nasr City, Cairo Governorate, Egypt",
    addressAR: "مول سيتي ستارز، مدينة نصر، محافظة القاهرة، مصر",
    imageURL: "https://www.citystars-heliopolis.com.eg/public/images/brand_logo/BkPskEPYzl-main.jpeg?1507026412294",
    googleMapsLink: "https://maps.app.goo.gl/cehkh5AUxRHczaZq9"
  }];

export default function CinemasPage() {

  const { lang } = useLanguage();

  return (
    <div className="mx-auto w-5/6 lg:w-3/4 gap-16 my-8 min-h-screen max-w-7xl flex flex-col justify-start items-center">
      <h2 className="text-5xl font-bold">{translations.cinemas[lang]}</h2>
      <h3 className='font-bold text-2xl'>{lang === 'en' ? 'Find us on the map (Click on the image)' : 'ابحث عنّا على الخريطة (اضغط على الصورة)'}</h3>
      <div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
        {cinemas.map((cinema, index) => (
          <Link key={index} to={cinema.googleMapsLink} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-4 justify-start items-start p-4 border-tertiary border-4 bg-secondary rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <img src={cinema.imageURL} alt={lang === 'en' ? cinema.nameEN : cinema.nameAR} className="w-full h-70 object-cover rounded-lg" />
            <h3 className='font-bold text-3xl'>{lang === 'en' ? cinema.nameEN : cinema.nameAR}</h3>
            <p className='text-lg font-semibold'>{lang === 'en' ? cinema.addressEN : cinema.addressAR}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}