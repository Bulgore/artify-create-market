
import React from "react";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturedArtists from "@/components/FeaturedArtists";
import FeaturedProducts from "@/components/FeaturedProducts";
import CallToAction from "@/components/CallToAction";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-artify-cream">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturedArtists />
        <FeaturedProducts />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
