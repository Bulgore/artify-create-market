
import React, { useState, useEffect } from 'react';
import { ContentBlock, SliderBlock } from '@/types/content';
import { Link } from 'react-router-dom';

interface SliderBlockComponentProps {
  block: ContentBlock;
}

const SliderBlockComponent: React.FC<SliderBlockComponentProps> = ({ block }) => {
  const content = block.content as SliderBlock;
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (content.autoPlay && content.slides.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % content.slides.length);
      }, content.duration || 5000);
      return () => clearInterval(interval);
    }
  }, [content.autoPlay, content.slides.length, content.duration]);

  if (!content.slides || content.slides.length === 0) {
    return (
      <div className="bg-gray-200 h-64 flex items-center justify-center rounded-lg">
        <p className="text-gray-500">Aucune image configurée</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
      {content.slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {slide.link ? (
            <Link to={slide.link} className="block w-full h-full">
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </Link>
          ) : (
            <img 
              src={slide.image} 
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          )}
          {slide.title && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <h3 className="text-white text-xl font-bold">{slide.title}</h3>
              {slide.description && (
                <p className="text-white/90 text-sm mt-1">{slide.description}</p>
              )}
            </div>
          )}
        </div>
      ))}
      
      {content.showDots && content.slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {content.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Aller à la slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      
      {content.slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide((prev) => prev === 0 ? content.slides.length - 1 : prev - 1)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Slide précédente"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % content.slides.length)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Slide suivante"
          >
            ›
          </button>
        </>
      )}
    </div>
  );
};

export default SliderBlockComponent;
