import React from 'react';
import styles from './Home.module.css';
import Slider from '../Slider/Slider';
import NowShowing from '../NowShowing/NowShowing';
import ComingSoon from '../ComingSoon/ComingSoon';
import { useState } from 'react';
import { useEffect } from 'react';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';

export default function Home() {

  const [movies, setmovies] = useState({
    released: [],
    comingSoon: []
  });

  const [posters, setPosters] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/movies/home');
      const data = await response.json();
      setmovies(data);
      console.log('Fetched movies:', data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError(true);
    }

  };

  const fetchPosters = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:4000/api/posters');
      const data = await response.json();
      setPosters(data);
    } catch (error) {
      console.error('Error fetching posters:', error);
      setError(true);
    }

  };

  const fetchData = async () => {
    await fetchMovies();
    await fetchPosters();
    setLoading(false);
  }


useEffect(() => {
  fetchData();
}, []);

return (
  <div className="w-full lg:p-8  mx-auto">
    {loading && <LoadingElement />}
    {error && <ErrorElement />}
    {!loading && !error && <>
      <Slider posters={posters} />
      <NowShowing loadedMovies={movies.released} />
      <ComingSoon />
    </>}
  </div>
);
}