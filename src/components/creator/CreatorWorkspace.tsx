
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CreatorNavigation from './CreatorNavigation';
import CustomProductCreator from './CustomProductCreator';
import DesignList from './DesignList';
import SalesPanel from './SalesPanel';
import CreatorProfile from './CreatorProfile';
import CreatorMediaManagement from './CreatorMediaManagement';
import CreatorAnalytics from './CreatorAnalytics';
import CreatorSettings from './CreatorSettings';

const CreatorWorkspace: React.FC = () => {
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'dashboard';

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <DesignList />;
      case 'create':
        return <CustomProductCreator />;
      case 'media':
        return <CreatorMediaManagement />;
      case 'analytics':
        return <CreatorAnalytics />;
      case 'profile':
        return <CreatorProfile />;
      case 'settings':
        return <CreatorSettings />;
      case 'dashboard':
      default:
        return <SalesPanel />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <CreatorNavigation />
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorWorkspace;
