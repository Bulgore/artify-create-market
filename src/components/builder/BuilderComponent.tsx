
import React from 'react';

interface BuilderComponentProps {
  model?: string;
  content?: any;
}

const BuilderComponent: React.FC<BuilderComponentProps> = ({ model, content }) => {
  return (
    <div className="p-6 text-center">
      <h2 className="text-xl font-semibold mb-4">Constructeur de Pages</h2>
      <p className="text-gray-600">
        Le constructeur de pages sera bientôt disponible avec notre système de blocs intégré.
      </p>
    </div>
  );
};

export default BuilderComponent;
