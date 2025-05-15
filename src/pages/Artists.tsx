
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArtistCard from "@/components/ArtistCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Artists = () => {
  const artists = [
    {
      id: 1,
      name: "Emma Martin",
      image: "/placeholder.svg",
      bio: "Artiste graphique spécialisée en illustrations abstraites",
    },
    {
      id: 2,
      name: "Lucas Chevalier",
      image: "/placeholder.svg",
      bio: "Photographe et designer de mode contemporaine",
    },
    {
      id: 3,
      name: "Maya Laurent",
      image: "/placeholder.svg",
      bio: "Illustratrice de nature et paysages du Pacifique",
    },
    {
      id: 4,
      name: "Thomas Dubois",
      image: "/placeholder.svg",
      bio: "Designer graphique spécialisé en typographie moderne",
    },
    {
      id: 5,
      name: "Léa Bernard",
      image: "/placeholder.svg",
      bio: "Créatrice de motifs inspirés des cultures polynésiennes",
    },
    {
      id: 6,
      name: "Antoine Moreau",
      image: "/placeholder.svg",
      bio: "Artiste digital et concepteur d'illustrations minimalistes",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Créateurs</h1>
          
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <Input
              type="text"
              placeholder="Rechercher un créateur..."
              className="pr-10 rounded-full border-gray-300"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {artists.map((artist) => (
            <ArtistCard
              key={artist.id}
              name={artist.name}
              image={artist.image}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Artists;
