import React, { useState, useEffect } from 'react';
import Image1 from '../../assets/A.jpg';
import Image2 from '../../assets/B.jpg';
import Image3 from '../../assets/C.jpg';
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    { src: Image1 },
    { src: Image2 },
    { src: Image3 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
<div className="relative w-full h-[250px] sm:h-[320px] md:h-[360px] lg:h-[450px] xl:h-[500px] overflow-hidden">
      {/* Slides */}
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            currentImageIndex === index ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={image.src}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 text-white hover:bg-black/60 rounded-full p-2 sm:p-3 z-10 transition"
      >
        <FaChevronLeft size={18} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 text-white hover:bg-black/60 rounded-full p-2 sm:p-3 z-10 transition"
      >
        <FaChevronRight size={18} />
      </button>
    </div>
  );
};

export default HeroSection;
