
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw } from "lucide-react";
import { PageData } from "@/types/pages";
import { fetchPageBySlug } from "@/services/pagesService";

const CustomPage = () => {
  const { pageTitle } = useParams<{ pageTitle: string }>();
  const [pageContent, setPageContent] = useState<string>("");
  const [pageData, setPageData] = useState<PageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPage = async () => {
      setIsLoading(true);
      try {
        if (!pageTitle) {
          throw new Error("Titre de page non défini");
        }
        
        const slug = pageTitle.toLowerCase().replace(/\s+/g, '-');
        const { data, error } = await fetchPageBySlug(slug);

        if (error) {
          throw error;
        }

        if (data) {
          setPageData(data);
          setPageContent(data.content);
        } else {
          // Page not found
          navigate('/404');
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de la page:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger cette page.",
        });
        navigate('/404');
      } finally {
        setIsLoading(false);
      }
    };

    if (pageTitle) {
      fetchPage();
    }
  }, [pageTitle, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="container mx-auto px-6 py-12 flex items-center justify-center">
          <RefreshCw className="h-12 w-12 animate-spin text-gray-400" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 py-12"
      >
        <article className="prose mx-auto">
          <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        </article>
      </motion.div>
      <Footer />
    </div>
  );
};

export default CustomPage;
