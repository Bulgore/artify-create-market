
import React from "react";

interface ArtistCardProps {
  name: string;
  image: string;
}

const ArtistCard = ({ name, image }: ArtistCardProps) => {
  return (
    <div className="bg-white rounded-lg p-6 flex flex-col items-center transition-all hover:shadow-lg">
      <div className="w-24 h-24 rounded-full overflow-hidden mb-4">
        <img 
          src={image} 
          alt={`Artiste ${name}`} 
          className="w-full h-full object-cover"
        />
      </div>
      <h3 className="text-lg font-medium text-gray-900">{name}</h3>
    </div>
  );
};

export default ArtistCard;
