
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PrinterCardProps {
  name: string;
  location: string;
  specialty: string;
  image: string;
}

const PrinterCard = ({ name, location, specialty, image }: PrinterCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-1">{name}</h3>
        <p className="text-sm text-gray-600 mb-2">{location}</p>
        <p className="text-sm text-gray-600 mb-4">{specialty}</p>
        <Link to={`/printers/${encodeURIComponent(name.toLowerCase().replace(/ /g, '-'))}`}>
          <Button className="w-full bg-[#33C3F0] hover:bg-[#0FA0CE] text-white">
            Voir Détails
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

const Printers = () => {
  const printers = [
    {
      id: 1,
      name: "Pacific Print Co.",
      location: "Papeete, Tahiti",
      specialty: "T-shirts et accessoires textile",
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "Oceania Graphics",
      location: "Nouméa, Nouvelle-Calédonie",
      specialty: "Posters et impressions grand format",
      image: "/placeholder.svg",
    },
    {
      id: 3,
      name: "Island Merch",
      location: "Suva, Fidji",
      specialty: "Produits promotionnels et goodies",
      image: "/placeholder.svg",
    },
    {
      id: 4,
      name: "Mana Prints",
      location: "Apia, Samoa",
      specialty: "Vêtements personnalisés et broderie",
      image: "/placeholder.svg",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Imprimeurs</h1>
          
          <div className="relative mt-4 md:mt-0 w-full md:w-64">
            <Input
              type="text"
              placeholder="Rechercher un imprimeur..."
              className="pr-10 rounded-full border-gray-300"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {printers.map((printer) => (
            <PrinterCard
              key={printer.id}
              name={printer.name}
              location={printer.location}
              specialty={printer.specialty}
              image={printer.image}
            />
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Printers;
