
import React from "react";
import { Navigate } from "react-router-dom";

// Page des imprimeurs supprimée dans V2 - redirection vers l'accueil
const Printers = () => {
  return <Navigate to="/" replace />;
};

export default Printers;
