import React from 'react';
import styles from './Home.module.css';
import Slider from '../Slider/Slider';
import NowShowing from '../NowShowing/NowShowing';
import ComingSoon from '../ComingSoon/ComingSoon';

export default function Home() {
  return (
    <div className="w-full lg:p-8">
      <Slider></Slider>
      <NowShowing></NowShowing>
      <ComingSoon></ComingSoon>
    </div>
  );
}