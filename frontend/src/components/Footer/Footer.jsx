import React from 'react';
import styles from './Footer.module.css';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faSquareFacebook, faSquareInstagram, faSquareXTwitter, faSquareYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import translations from '../../lang/main.json';

export default function Footer() {

  const { lang } = useLanguage();

  return (
    <div className="bg-tertiary  w-full p-4 flex flex-col lg:flex-row justify-evenly items-start text-white gap-8 pb-16 divide-y lg:divide-y-0 divide-white/50">
      <div className="flex flex-col justify-center items-start gap-2 py-2 lg:py-0 lg:px-2">
        <h3 className="text-lg font-semibold">{translations.mainName[lang]}</h3>
        <div className="flex flex-row gap-2">
          <Link to="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareFacebook} size="2x" />
          </Link>
          <Link to="https://www.x.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareXTwitter} size="2x" />
          </Link>
          <Link to="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareInstagram} size="2x" />
          </Link>
          <Link to="https://www.youtube.com" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faSquareYoutube} size="2x" />
          </Link>
        </div>
        <p>Copyright © {new Date().getFullYear()} {translations.rightsReserved[lang]}.</p>
        <a href="mailto:contact@kanma-cinemas.com" dir='ltr'><FontAwesomeIcon icon={faEnvelope} /> contact@kanma-cinemas.com</a>
        <a href="tel:+201012345678" dir='ltr'><FontAwesomeIcon icon={faPhone} /> +20 101 234 5678</a>
        <a href="tel:55555" dir='ltr'><FontAwesomeIcon icon={faPhone} />55555</a>
      </div>
      <div className="flex flex-row gap-8 justify-center items-start h-full py-2 lg:py-0 lg:px-2">
        <div className="flex flex-col justify-center items-start gap-2">
          <h3 className="text-lg font-semibold">{translations.quickLinks[lang]}</h3>
          <Link to="/" className="hover:underline">{translations.home[lang]}</Link>
          <Link to="/movies/now-showing" className="hover:underline">{translations.nowShowing[lang]}</Link>
          <Link to="/movies/coming-soon" className="hover:underline">{translations.comingSoon[lang]}</Link>
          <Link to="/support/contact" className="hover:underline">{translations.contactUs[lang]}</Link>
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <h3 className="text-lg font-semibold">{translations.support[lang]}</h3>
          <Link to="/support/terms-and-conditions" className="hover:underline">{translations.termsAndConditions[lang]}</Link>
          <Link to="/support/terms-of-use" className="hover:underline">{translations.termsOfUse[lang]}</Link>
          <Link to="/support/privacy-policy" className="hover:underline">{translations.privacyPolicy[lang]}</Link>
          <Link to="/support/refunds" className="hover:underline">{translations.refundPolicy[lang]}</Link>
          <Link to="/support/faq" className="hover:underline">{translations.faq[lang]}</Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-start gap-2 py-2 lg:py-0 lg:px-2">
          <h3 className="text-lg font-semibold">{translations.explore[lang]}</h3>
          <Link to="/sitemap" className="hover:underline">{translations.siteMap[lang]}</Link>
        </div>
    </div>
  );
}