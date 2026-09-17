import React from 'react';
import styles from './MovieDetails.module.css';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';

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


export default function MovieDetails() {

  const { id } = useParams(); // Get the movie ID from the URL parameters
  const { lang } = useLanguage();

  let movieData = {
    titleEn: "Spider-Man: Brand New Day",
    titleAr: "سبايدر مان: يوم جديد",
    poster: "https://assets.voxcinemas.com/posters/P_HO00013065_1782227665332.jpg",
    ageRating: "12+",
    language: "en",
    isBookable: true,
    descriptionEn: "Peter Parker's life takes a new turn as he navigates the challenges of being Spider-Man while balancing his personal life and responsibilities.",
    descriptionAr: "حياة بيتير باركر تأخذ مساراً جديداً بينما يتنقل بين تحديات كونه سبايدر مان مع التوازن بين حياته الشخصية ومسؤولياته.",
    releaseDate: "2024-05-15",
    director: "John Doe",
    cast: "Tom Holland, Zendaya, Benedict Cumberbatch",
    genre: "Action, Adventure, Sci-Fi",
    duration: "138 min",
    trairlerUrl: "https://www.youtube.com/watch?v=example"
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center py-8 max-w-7xl mx-auto">
      <div className="border-tertiary mx-auto border-2 w-5/6 lg:w-3/4 p-4 rounded-3xl flex flex-col justify-center items-center">
        <div className='w-5/6 flex flex-col lg:flex-row justify-between items-center gap-8'>
          <div className="relative">
            <img src={movieData.poster} alt={movieData.titleEn} className="aspect-2/3 object-cover h-100 rounded-2xl" />
            <div className="absolute w-12 h-12 rounded-full bg-tertiary border border-white top-2 right-2 flex justify-center items-center shadow">
              <span className="text-white text-sm font-bold">{movieData.ageRating}</span>
            </div>
          </div>
          <div>
            <iframe className="w-full h-full lg:w-84 lg:h-74 xl:w-100" src="https://www.youtube.com/embed/vHqmeP2fusg?si=UaM6CGiBfG-VvEM_" title="Trailer" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
        </div>
        <div className="w-full mt-4 flex flex-col gap-2 text-center lg:text-start">
          {lang === 'ar' ? (
            <>
              <h1 className="text-2xl font-bold">{movieData.titleAr}</h1>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold">{movieData.titleEn}</h1>
            </>
          )}
          { movieData.isBookable ?
          <div className="flex items-center justify-center m-2 p-4">
            <Link to={`/book/${id}`} className="bg-tertiary text-white py-2 px-4 rounded-2xl hover:bg-secondary">
              {translations.bookNow[lang]}
            </Link>
          </div> : <></>}
          <div className="grid w-full gap-4 grid-cols-1 lg:grid-cols-2">
            <p className="text-lg font-bold">{translations.description[lang]}:</p>
            <p className="text-lg">{lang === 'ar' ? movieData.descriptionAr : movieData.descriptionEn}</p>
            <p className="text-lg font-bold">{translations.duration[lang]}:</p>
            <p className="text-lg">{movieData.duration}</p>
            <p className="text-lg font-bold">{translations.language[lang]}:</p>
            <img src={FLAGS[movieData.language]} alt={movieData.language} className="w-6 h-6" />
            <p className="text-lg font-bold">{translations.director[lang]}:</p>
            <p className="text-lg">{movieData.director}</p>
            <p className="text-lg font-bold">{translations.cast[lang]}:</p>
            <p className="text-lg">{movieData.cast}</p>
            <p className="text-lg font-bold">{translations.releaseDate[lang]}:</p>
            <p className="text-lg">{movieData.releaseDate}</p>
            <p className="text-lg font-bold">{translations.ageRating[lang]}:</p>
            <p className="text-lg">{movieData.ageRating}</p>
            <p className="text-lg font-bold">{translations.genre[lang]}:</p>
            <p className="text-lg">{movieData.genre}</p>
          </div>
        </div>
      </div>
    </div>
  );
}