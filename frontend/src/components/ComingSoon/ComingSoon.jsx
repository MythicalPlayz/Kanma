import React from 'react';
import styles from './ComingSoon.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import MovieCover from '../MovieCover/MovieCover';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useEffect } from 'react';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';

export default function ComingSoon({ showAll = false, loadedMovies = [] }) {

  const [movies, setMovies] = useState(loadedMovies);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchMovies = async () => {
    if (movies.length > 0) return; // If movies are already loaded, do not fetch again
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/movies/comingsoon');
      const data = await response.json();
      setMovies(data);
      console.log('Fetched movies:', data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(true);
    } finally {
      setLoading(false);
    }

  };

  useEffect(() => {
    fetchMovies();
  }, []);

  const { lang, setLang, isRTL } = useLanguage();
  return (
    <div className=" flex flex-col justify-center gap-8 my-4 px-8  mx-auto">
      {loading && <LoadingElement />}
      {error && <ErrorElement />}
      <h2 className="text-3xl font-bold uppercase mx-auto flex items-center gap-2 lg:mx-0">{<FontAwesomeIcon icon={faFilm} />} {translations.comingSoon[lang]}</h2>
      <div className="w-full md:w-5/6 lg:w-3/4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 grid-start-row items-start mx-auto">
        {movies.map((movie, index) => (
                      <MovieCover key={index} titleEn={movie.titleEN} titleAr={movie.titleAR} poster={movie.posterURL} ageRating={movie.rating} language={movie.language} isBookable={movie.canBook} movieId={movie.id} />
        ))}
      </div>
      {!showAll && (
        <div className="w-full flex justify-center items-center">
          <Link to="/movies/coming-soon" className="bg-tertiary p-4 rounded-md font-bold text-white hover:cursor-pointer hover:bg-tertiary/80 transition-all duration-300">
            {translations.loadMore[lang]}
          </Link>
        </div>
      )}
    </div>
  );
}