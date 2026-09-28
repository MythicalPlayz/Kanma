import React, { useEffect, useState } from 'react';
import styles from './SupportPageFaq.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import ErrorElement from '../ErrorElement/ErrorElement';
import LoadingElement from '../LoadingElement/LoadingElement';
export default function SupportPageFaq() {

    const [faqData, setFaqData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
  
    const featchSupportData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/support/faq');
        const data = await response.json();
        setFaqData(data);
        console.log('Fetched FAQ data:', data);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
        setError(true);
      }
      finally {
        setLoading(false);
      }
  
    };

    useEffect(() => {
      featchSupportData();
    }, []);

  const { lang } = useLanguage();

  return (
    <div className="w-full flex flex-col justify-start items-start gap-12">
      <h2 className="text-4xl font-bold text-center relative mb-4">{translations.faq[lang]}
        <div className="absolute -bottom-2.5 left-0 right-0 transform w-full lg:w-3/4 mx-auto lg:mx-0 h-1 bg-secondary" />
      </h2>
      {loading && <LoadingElement />}
      {error && <ErrorElement />}
      <div className="w-full flex flex-col gap-4">
        {!error && !loading && faqData[lang].map((item, index) => (
          <div key={index} className="w-full flex flex-col gap-2 bg-secondary p-4 rounded-md">
            <div className="w-full flex flex-row items-center gap-2">
              <FontAwesomeIcon icon={faQuestionCircle} className="text-xl" />
              <h3 className="text-2xl font-semibold">{item.question}</h3>
            </div>
            <p className="text-lg">{item.answer}</p>
          </div>
        ))}
      </div>
      <Link to="/support" className="bg-tertiary text-white py-2 px-4 rounded-md hover:bg-secondary transition-all duration-300">{translations.goback[lang]}</Link>
    </div>
  );
}