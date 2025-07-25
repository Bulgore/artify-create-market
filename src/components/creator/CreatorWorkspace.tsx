
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import CreatorNavigation from './CreatorNavigation';
import CustomProductCreator from './CustomProductCreator';
import DesignList from './DesignList';
import { EditCreatorProduct } from './EditCreatorProduct';
import SalesPanel from './SalesPanel';
import CreatorProfile from './CreatorProfile';
import CreatorMediaManagement from './CreatorMediaManagement';
import CreatorAnalytics from './CreatorAnalytics';
import CreatorSettings from './CreatorSettings';

interface Design {
  id: string;
  name: string;
  description?: string;
  preview_url: string;
  is_published: boolean;
  creator_margin_percentage: number;
}

const CreatorWorkspace: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const activeTab = searchParams.get('tab') || 'dashboard';

  const loadDesigns = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('creator_products')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the data to match the Design interface
      const mappedDesigns = (data || []).map(item => ({
        id: item.id,
        name: item.name_fr || '', // Use French name as default
        description: item.description_fr || undefined,
        preview_url: item.preview_url || '',
        is_published: item.is_published,
        creator_margin_percentage: item.creator_margin_percentage
      }));
      
      setDesigns(mappedDesigns);
    } catch (error) {
      console.error('Error loading designs:', error);
    }
  };

  useEffect(() => {
    loadDesigns();
  }, [user]);

  const handleCreateDesign = () => {
    setSearchParams({ tab: 'create' });
  };

  const handleEditDesign = (id: string) => {
    setSearchParams({ tab: 'edit', id });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return (
          <DesignList
            designs={designs}
            onDesignUpdated={loadDesigns}
            onCreateDesign={handleCreateDesign}
            onEditDesign={handleEditDesign}
          />
        );
      case 'create':
        return <CustomProductCreator />;
      case 'edit': {
        const editId = searchParams.get('id');
        if (!editId) return null;
        return (
          <EditCreatorProduct
            productId={editId}
            onUpdated={() => {
              loadDesigns();
              setSearchParams({ tab: 'products' });
            }}
            onBack={() => setSearchParams({ tab: 'products' })}
          />
        );
      }
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
