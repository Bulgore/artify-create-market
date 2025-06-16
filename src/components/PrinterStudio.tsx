
import React from "react";
import { Navigate } from "react-router-dom";

// Composant PrinterStudio supprimé dans V2 - les imprimeurs n'ont plus d'accès
const PrinterStudio: React.FC = () => {
  return <Navigate to="/" replace />;
};

export default PrinterStudio;
