import React, { useEffect, useState } from 'react';
import styles from './SupportPageItem.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';
import { Link } from 'react-router-dom';
import LoadingElement from '../LoadingElement/LoadingElement';
import ErrorElement from '../ErrorElement/ErrorElement';


export default function SupportPageItem({item}) {

    const [itemData, setItemData] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    const itemToAPIMap = {
        'termsAndConditions': 'toc',
        'termsOfUse': 'tou',
        'privacyPolicy': 'pp'
    };
  
    const featchSupportData = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:4000/api/support/' + itemToAPIMap[item]);
        const data = await response.json();
        setItemData(data);
        console.log('Fetched policy data:', data);
      } catch (error) {
        console.error('Error fetching policy data:', error);
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
      <h2 className="text-4xl font-bold text-center relative mb-4">{translations[item][lang]}
        <div className="absolute -bottom-2.5 left-0 right-0 transform w-full lg:w-3/4 mx-auto lg:mx-0 h-1 bg-secondary" />
      </h2>
      {loading && <LoadingElement />}
      {error && <ErrorElement />}
      {itemData && !loading && !error && <div className="w-full flex flex-col gap-4">
        <div className='whitespace-pre-line' dangerouslySetInnerHTML={{ __html: itemData[lang] }} />
      </div>}
      <Link to="/support" className="bg-tertiary text-white py-2 px-4 rounded-md hover:bg-secondary transition-all duration-300">{translations.goback[lang]}</Link>
    </div>
  );
}