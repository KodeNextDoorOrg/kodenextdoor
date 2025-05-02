import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

export interface CarouselSlide {
  image: string;
  title: string;
  description: string;
  cta?: string;
  link?: string;
}

interface CarouselProps {
  slides: CarouselSlide[];
  autoplaySpeed?: number;
  className?: string;
}

const Carousel: React.FC<CarouselProps> = ({ 
  slides, 
  autoplaySpeed = 6000,
  className = ""
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Handle automatic slide transition
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isAutoPlaying) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
      }, autoplaySpeed);
    }
    
    return () => clearInterval(interval);
  }, [isAutoPlaying, slides.length, autoplaySpeed]);

  // Pause autoplay on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);
  
  // Navigation functions
  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };
  
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };
  
  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div 
      className={`carousel-container ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {slides.map((slide, index) => (
        <div
          key={index}
          className="carousel-slide"
          style={{
            transform: `translateX(${(index - currentSlide) * 100}%)`,
            zIndex: index === currentSlide ? 10 : 5,
            opacity: index === currentSlide ? 1 : 0.7,
          }}
        >
          <div className="carousel-image">
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              style={{ objectFit: "cover" }}
              priority={index === 0}
            />
          </div>
          
          <div className="carousel-content">
            <h2>{slide.title}</h2>
            <p>{slide.description}</p>
            {slide.cta && slide.link && (
              <Link href={slide.link} className="medalina-btn">
                {slide.cta}
              </Link>
            )}
          </div>
        </div>
      ))}

      {/* Carousel controls */}
      <button
        className="carousel-control prev"
        onClick={goToPrevSlide}
        aria-label="Previous slide"
      >
        <FaChevronLeft />
      </button>
      <button
        className="carousel-control next"
        onClick={goToNextSlide}
        aria-label="Next slide"
      >
        <FaChevronRight />
      </button>

      {/* Carousel indicators */}
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`carousel-dot ${index === currentSlide ? "active" : ""}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel; 