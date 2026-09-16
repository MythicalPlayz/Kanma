import React from 'react';
import styles from './ShowMoviesPage.module.css';
import translations from '../../lang/main.json';
import { useLanguage } from '../../contexts/LanguageContext';
import NowShowing from '../NowShowing/NowShowing';
import ComingSoon from '../ComingSoon/ComingSoon';

export default function ShowMoviesPage({type}) {

  return (
    <div className="flex flex-col justify-center gap-8 my-4 px-8">
      {type === 'nowShowing' && <NowShowing showAll={true} />}
      {type === 'comingSoon' && <ComingSoon showAll={true} />}
    </div>
  );
}