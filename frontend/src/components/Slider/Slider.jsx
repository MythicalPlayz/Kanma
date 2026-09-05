import React, { useState } from 'react';
import styles from './Slider.module.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const slides = [
  {
    url: "https://assets.voxcinemas.com/content/Mahmoud_El_Tany_1HP-banner_EN_1786530849.jpg",
    alt: "Slider Image 1",
    link: "/"
  },
  {
    url: "https://assets.voxcinemas.com/content/newslatter-banner__1__1748876996.png",
    alt: "Slider Image 2",
    link: "/"
  },
  {
    url: "https://assets.voxcinemas.com/content/IMG_2163_1748877141.PNG",
    alt: "Slider Image 3",
    link: "/"
  },
  {
    url: "https://assets.voxcinemas.com/content/Spider_Man_1HP-banner_EN_1784717789.jpg",
    alt: "Slider Image 4",
    link: "/"
  },
];

// Helper to handle negative numbers in JS modulo
const getIndex = (i, len) => ((i % len) + len) % len;

export default function Slider() {
  const [sliderIndex, setSliderIndex] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Initial window: [slide 0, slide 1, slide 2]
  const [activeSlides, setActiveSlides] = useState([
    slides[0],
    slides[1],
    slides[2]
  ]);

  const moveSlides = async (nextIndex, positive = true) => {
    setIsAnimating(true);
    const slideElements = document.querySelectorAll('.slide');

    // 1. Animate offset
    slideElements.forEach((slide) => {
      slide.style.transition = 'left 0.5s ease-in-out';
      slide.style.left = `${parseInt(slide.style.left || 0) - 100 * (positive ? 1 : -1)}%`;
    });

    // Wait for the CSS transition to complete
    await new Promise((resolve) => setTimeout(resolve, 500));

    // 2. Disable transition to snap back silently
    slideElements.forEach((slide, idx) => {
      slide.style.transition = 'none';
      slide.style.left = `${(idx - 1) * 100}%`;
    });

    // 3. Force reflow
    if (slideElements[0]) {
      void slideElements[0].offsetHeight;
    }

    // 4. Update the 3 rendered slides in React state
    setActiveSlides([
      slides[getIndex(nextIndex - 1, slides.length)],
      slides[getIndex(nextIndex, slides.length)],
      slides[getIndex(nextIndex + 1, slides.length)]
    ]);

    setIsAnimating(false);
  };

  const handlePrevSlide = () => {
    if (isAnimating) return;
    const newIndex = getIndex(sliderIndex - 1, slides.length);
    setSliderIndex(newIndex);
    moveSlides(newIndex, false);
  };

  const handleNextSlide = () => {
    if (isAnimating) return;
    const newIndex = getIndex(sliderIndex + 1, slides.length);
    setSliderIndex(newIndex);
    moveSlides(newIndex, true);
  };

  return (
    <div className="w-full flex items-center justify-center p-8">
      <div className="w-220 h-60 md:h-90 lg:h-110 bg-gray-300 rounded-lg overflow-hidden relative flex flex-nowrap flex-row items-center justify-center transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-lg">
        {activeSlides.map((slide, index) => (
          <Link to={slide.link} key={`${slide.url}-${index}`} className="slide absolute w-full h-full" style={{ left: `${(index - 1) * 100}%`, top: '0' }}>
            <img src={slide.url} alt={slide.alt} className="w-full h-full object-cover" />
          </Link>
        ))}

        <button className="absolute top-50 bottom-50 left-5 w-10 h-10 bg-tertiary rounded-full hover:cursor-pointer z-10 border border-white" onClick={handlePrevSlide} aria-label="Previous slide">
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>



        <button className="absolute top-50 bottom-50 right-5 w-10 h-10 bg-tertiary rounded-full hover:cursor-pointer z-10 border border-white" onClick={handleNextSlide} aria-label="Next slide">
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}