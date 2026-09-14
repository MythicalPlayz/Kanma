import React from 'react';
import styles from './E404.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlugCircleXmark } from '@fortawesome/free-solid-svg-icons';

export default function E404() {
  return (
    <div className="w-full min-h-screen flex flex-col gap-4 items-center justify-center">
      <FontAwesomeIcon icon={faPlugCircleXmark} className="text-red-500 text-6xl" />
      <h2 className="text-9xl font-bold">404</h2>
      <p className="text-lg">Page Not Found</p>
      <Link to="/" className="text-blue-500 hover:underline">Go Back Home</Link>
    </div>
  );
}