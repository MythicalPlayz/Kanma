import React, { useEffect, useState } from 'react';
import styles from './BookPage.module.css';
import { Link, useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { getAccountContext } from '../../contexts/AccountContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClapperboard, faFilm, faTicket } from '@fortawesome/free-solid-svg-icons';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';

const monthsToNumber = {
  Jan: '01',
  Feb: '02',
  Mar: '03',
  Apr: '04',
  May: '05',
  Jun: '06',
  Jul: '07',
  Aug: '08',
  Sep: '09',
  Oct: '10',
  Nov: '11',
  Dec: '12'
}

export default function BookPage() {

  const { movieId } = useParams();
  const [showtimes, setShowtimes] = useState([]);
  const { lang } = useLanguage();
  const [selectedTimeOption, setSelectedTimeOption] = useState(0);
  const { accessToken } = getAccountContext();
  const [dates, setDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchShowtimes = async (movieId = "", cinemaId = "", date = "") => {
    if (!accessToken) {
      console.log('No access token found, redirecting to login page');
      navigateTo('/account/login');
      return;
    }
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`http://localhost:4000/api/showtimes?movieId=${movieId}&cinemaId=${cinemaId}&date=${date}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      formatShowtimes(data);
      console.log('Fetched showtimes:', data);
    } catch (error) {
      console.error('Error fetching showtimes:', error);
      if (error.response && error.response.status === 401) {
        console.log('Unauthorized access, redirecting to login page');
        navigateTo('/account/login');
      }
      setShowtimes([]);
      setError(true);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1).toString().padStart(2, '0') + '-' + new Date().getDate().toString().padStart(2, '0');
    fetchShowtimes(movieId, "", date);
  }, [movieId]);

  const formatShowtimes = (showtimeData) => {
    // this is the format hierarchy 
    // 1. Cinema Name
    // 2. Date
    // 3. Screen
    if (!showtimeData || showtimeData.length === 0) {
      setShowtimes([]);
      return;
    }
    const formattedData = {};

    // data input is sorted by movieId, cinemaId, startTime
    /**
     *  how it should look like this
     * [
     *   {
     *     movieId: {
     *       nameEN:
     *       nameAR:
     *       showtimes: {
     *        cinemaId: {
     *        nameEN:
     *        nameAR:
     *        type: {
                id
                dates = []
     *        }
     *      }
     *    } 
     *  }
     * }
     */

    for (const showtime of showtimeData) {


      // first create a movie id
      if (!formattedData[showtime.movieId.id]) {
        formattedData[showtime.movieId.id] = {
          titleEN: showtime.movieId.titleEN,
          titleAR: showtime.movieId.titleAR,
          posterURL: showtime.movieId.posterURL,
          cinemas: {}
        };
      }

      // create a cinema id
      if (!formattedData[showtime.movieId.id].cinemas[showtime.cinemaId.id]) {
        formattedData[showtime.movieId.id].cinemas[showtime.cinemaId.id] = {
          nameEN: showtime.cinemaId.nameEN,
          nameAR: showtime.cinemaId.nameAR,
          types: {}
        };
      }

      // create a screen type
      if (!formattedData[showtime.movieId.id].cinemas[showtime.cinemaId.id].types[showtime.screenId?.screenType.code]) {
        formattedData[showtime.movieId.id].cinemas[showtime.cinemaId.id].types[showtime.screenId?.screenType.code] = {
          id: showtime.screenId?.screenType.code,
          nameEN: showtime.screenId?.screenType.nameEN,
          nameAR: showtime.screenId?.screenType.nameAR,
          dates: [],
          ids: []
        };
      }

      // push the showtime to the dates array
      formattedData[showtime.movieId.id].cinemas[showtime.cinemaId.id].types[showtime.screenId?.screenType.code].dates.push(showtime.startTime);
      formattedData[showtime.movieId.id].cinemas[showtime.cinemaId.id].types[showtime.screenId?.screenType.code].ids.push(showtime.id);
    };

    setShowtimes(formattedData);
    console.log('Formatted showtimes:', formattedData);
  }

  const setupDate = () => {
    if (dates.length > 0) {
      return;
    }
    // Set up the date for the showtimes

    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      setDates(prev => [
        ...prev,
        {
          "dayAR": date.toLocaleDateString('ar-EG', { day: 'numeric' }),
          "dayEN": date.toLocaleDateString('en-US', { day: 'numeric' }),
          "monthAR": date.toLocaleDateString('ar-EG', { month: 'short' }),
          "monthEN": date.toLocaleDateString('en-US', { month: 'short' }),
        }
      ]);
    }
  }
  setupDate();

  const handleTimeOptionChange = (index, time) => {
    setSelectedTimeOption(index);
    fetchShowtimes(movieId, "", time);
  }

  const navigateTo = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center lg:items-start w-5/6 lg:w-3/4 mx-auto justify-center lg:justify-start p-8">
      <h2 className="text-4xl font-bold mb-4">We are happy to have you here!</h2>
      <div className="w-full grid grid-cols-7 gap-4 my-8">
        {loading && <LoadingElement/>}
        {error && <ErrorElement/>}
        {dates.map((date, index) => (
          <button
            key={index}
            className={`px-4 py-4 w-full ${selectedTimeOption === index ? 'bg-quaternary' : 'bg-tertiary'} text-white rounded hover:bg-secondary transition flex flex-col items-center justify-center hover:cursor-pointer`}
            onClick={() => handleTimeOptionChange(index, `${new Date().getFullYear()}-${monthsToNumber[date.monthEN]}-${date.dayEN}`)}
          >
            <span className="text-2xl font-semibold">{lang === 'en' ? date.dayEN : date.dayAR}</span>
            <span className="text-sm">{lang === 'en' ? date.monthEN : date.monthAR}</span>
          </button>
        ))
        }
      </div>
      <div className="w-full flex flex-col gap-8">
        {showtimes.length == 0 && <p className="text-lg">No showtimes available for this movie.</p>}
        {Object.values(showtimes).map((movie) => (
          <div key={movie.id} className="w-full flex lg:flex-row flex-col gap-4 items-center lg:items-start">
            <img src={movie.posterURL} alt={lang === 'en' ? movie.titleEN : movie.titleAR} className="w-32 h-auto rounded" />
            <div key={movie} className="w-full flex flex-col gap-4 items-center">
              <div className="flex gap-4 justify-start w-full">
                <FontAwesomeIcon icon={faClapperboard} size="2x" />
                <h3 className="text-2xl font-semibold mb-4">{lang === 'en' ? movie.titleEN : movie.titleAR}</h3>
              </div>
              {Object.values(movie.cinemas).map((cinema) => (
                <div key={cinema.nameEN} className="w-full flex flex-col gap-2">
                  <div className="flex gap-4">
                    <FontAwesomeIcon icon={faTicket} size="xl" />
                    <h4 className="text-xl font-semibold mb-2">{lang === 'en' ? cinema.nameEN : cinema.nameAR}</h4>
                  </div>
                  {Object.values(cinema.types).map((type) => (
                    <div key={type} className="w-full flex flex-col gap-1">
                      <div className="flex gap-4 items-baseline">
                        <FontAwesomeIcon icon={faFilm} size="lg" />
                        <h5 className="text-lg font-semibold mb-1">{type ? (lang === 'en' ? type.nameEN : type.nameAR) : 'Unknown Type'}</h5>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {type.dates.map((date) => (
                          <Link
                            to={'/confirm-booking/' + type.ids[type.dates.indexOf(date)]}
                            key={date}
                            className="px-4 py-2 bg-tertiary text-white rounded hover:bg-secondary transition"
                          >
                            {new Date(date).toLocaleString(lang === 'en' ? 'en-US' : 'ar-EG', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        ))}
      </div>

    </div>
  );
}