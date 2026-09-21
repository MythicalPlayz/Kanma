import React from 'react';
import styles from './ErrorElement.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export default function ErrorElement() {
  return (
    <div className="w-full p-8 mx-auto text-center">
      <div className="flex justify-center flex-col lg:flex-row items-center p-8 gap-8 bg-red-500 w-fit mx-auto rounded-lg">
        <FontAwesomeIcon icon={faExclamationTriangle} size='5x' className="text-white"/>
        <div className="text-2xl font-bold text-white flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Something went wrong try again later!</h1>
          <h1 className="text-2xl font-bold">حدث خطأ، يرجى المحاولة لاحقًا</h1>
        </div>
      </div>
    </div>
  );
}