
import React from "react";
import ArtistCard from "./ArtistCard";

const FeaturedArtists = () => {
  const artists = [
    {
      id: 1,
      name: "Emma Martin",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Lucas Chevalier",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Maya Laurent",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Thomas Dubois",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-10">
          Découvrir les artistes
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <ArtistCard 
              key={artist.id} 
              name={artist.name} 
              image={artist.image} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedArtists;
