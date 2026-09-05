import React from 'react';
import styles from './Home.module.css';
import Slider from '../Slider/Slider';

export default function Home() {
  return (
    <div className="w-full lg:p-8">
      <Slider></Slider>
    </div>
  );
}