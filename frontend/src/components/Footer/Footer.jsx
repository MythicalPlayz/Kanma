import React from 'react';
import styles from './Footer.module.css';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faSquareFacebook, faSquareInstagram, faSquareXTwitter, faSquareYoutube } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="bg-tertiary w-full p-4 flex flex-col lg:flex-row justify-center items-start text-white gap-8 pb-16 divide-y lg:divide-y-0 lg:divide-x divide-white/50">
      <div className="flex flex-col justify-center items-start gap-2 py-2 lg:py-0 lg:px-2">
        <h3 className="text-lg font-semibold">Kanma Cinemas</h3>
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
        <p>Copyright © {new Date().getFullYear()} All rights reserved.</p>
        <a href="mailto:contact@kanma-cinemas.com"><FontAwesomeIcon icon={faEnvelope} /> contact@kanma-cinemas.com</a>
        <a href="tel:+201012345678"><FontAwesomeIcon icon={faPhone} /> +20 101 234 5678</a>
        <a href="tel:55555"><FontAwesomeIcon icon={faPhone} />55555</a>
      </div>
      <div className="flex flex-row gap-8 justify-center items-start h-full py-2 lg:py-0 lg:px-2">
        <div className="flex flex-col justify-center items-start gap-2">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/now-showing" className="hover:underline">Now Showing</Link>
          <Link to="/coming-soon" className="hover:underline">Coming Soon</Link>
          <Link to="/contact" className="hover:underline">Contact Us</Link>
        </div>
        <div className="flex flex-col justify-center items-start gap-2">
          <h3 className="text-lg font-semibold">Support</h3>
          <Link to="/support/terms-and-conditions" className="hover:underline">Terms and Conditions</Link>
          <Link to="/support/terms-of-use" className="hover:underline">Terms of Use</Link>
          <Link to="/support/privacy-policy" className="hover:underline">Privacy Policy</Link>
          <Link to="/support/refunds" className="hover:underline">Refunds</Link>
          <Link to="/support/faq" className="hover:underline">FAQ</Link>
        </div>
      </div>
      <div className="flex flex-col justify-center items-start gap-2 py-2 lg:py-0 lg:px-2">
          <h3 className="text-lg font-semibold">Explore</h3>
          <Link to="/sitemap" className="hover:underline">Site Map</Link>
        </div>
    </div>
  );
}