import React from 'react';
import styles from './LoadingElement.module.css';
import { TailSpin } from 'react-loader-spinner';

export default function LoadingElement() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center bg-gray-800/75 z-99">
      <TailSpin
        visible={true}
        height="160"
        width="160"
        color="#3282B8"
        ariaLabel="tail-spin-loading"
        radius="1"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}