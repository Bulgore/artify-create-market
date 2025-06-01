
import React from 'react';
import { builder } from '@builder.io/react';

// Clé API Builder.io
export const BUILDER_API_KEY = 'ccbbbeef7ae54db5929da7cd0575cf04';

// Initialisation de Builder.io
export const initBuilder = () => {
  builder.init(BUILDER_API_KEY);
};

// Configuration des modèles de contenu
export const registerModels = () => {
  // Enregistrer le modèle pour la page d'accueil
  builder.registerComponent(
    ({ welcomeText, subText, buttonText, buttonLink }) => {
      return (
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{welcomeText}</h1>
          <p className="text-gray-600 mb-6">{subText}</p>
          <a
            href={buttonLink}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {buttonText}
          </a>
        </div>
      );
    },
    {
      name: 'Hero',
      inputs: [
        { name: 'welcomeText', type: 'string', defaultValue: 'Bienvenue sur notre site' },
        { name: 'subText', type: 'string', defaultValue: 'Découvrez nos produits et services' },
        { name: 'buttonText', type: 'string', defaultValue: 'Explorer' },
        { name: 'buttonLink', type: 'string', defaultValue: '/products' }
      ],
    }
  );

  // Enregistrer le modèle pour les carousels d'images
  builder.registerComponent(
    ({ images, autoPlay = true, showDots = true }) => {
      const [currentSlide, setCurrentSlide] = React.useState(0);
      
      React.useEffect(() => {
        if (autoPlay && images?.length > 1) {
          const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % images.length);
          }, 5000);
          return () => clearInterval(interval);
        }
      }, [autoPlay, images?.length]);

      if (!images || images.length === 0) {
        return <div className="bg-gray-200 h-64 flex items-center justify-center">Aucune image</div>;
      }

      return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img 
                src={image.image} 
                alt={image.alt || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                  <h3 className="text-white text-xl font-bold">{image.title}</h3>
                  {image.description && (
                    <p className="text-white/90 text-sm mt-1">{image.description}</p>
                  )}
                </div>
              )}
            </div>
          ))}
          
          {showDots && images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      );
    },
    {
      name: 'ImageCarousel',
      inputs: [
        {
          name: 'images',
          type: 'list',
          subFields: [
            { name: 'image', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png', 'svg'] },
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'alt', type: 'string' }
          ],
          defaultValue: []
        },
        { name: 'autoPlay', type: 'boolean', defaultValue: true },
        { name: 'showDots', type: 'boolean', defaultValue: true }
      ],
    }
  );

  // Enregistrer le modèle pour les bannières publicitaires
  builder.registerComponent(
    ({ title, description, buttonText, buttonLink, backgroundImage, backgroundColor = '#f3f4f6' }) => {
      return (
        <div 
          className="relative p-8 rounded-lg text-center"
          style={{
            backgroundColor: backgroundImage ? 'transparent' : backgroundColor,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          {backgroundImage && (
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
          )}
          <div className="relative z-10">
            <h2 className={`text-2xl md:text-3xl font-bold mb-4 ${backgroundImage ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h2>
            {description && (
              <p className={`text-lg mb-6 ${backgroundImage ? 'text-white/90' : 'text-gray-600'}`}>
                {description}
              </p>
            )}
            {buttonText && buttonLink && (
              <a
                href={buttonLink}
                className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition font-medium"
              >
                {buttonText}
              </a>
            )}
          </div>
        </div>
      );
    },
    {
      name: 'PromoBanner',
      inputs: [
        { name: 'title', type: 'string', defaultValue: 'Offre spéciale' },
        { name: 'description', type: 'string', defaultValue: 'Découvrez nos promotions exceptionnelles' },
        { name: 'buttonText', type: 'string', defaultValue: 'En savoir plus' },
        { name: 'buttonLink', type: 'string', defaultValue: '/products' },
        { name: 'backgroundImage', type: 'file', allowedFileTypes: ['jpeg', 'jpg', 'png'] },
        { name: 'backgroundColor', type: 'color', defaultValue: '#f3f4f6' }
      ],
    }
  );
};
