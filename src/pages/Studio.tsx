
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CreatorStudio from '@/components/CreatorStudio';
import PrinterStudio from '@/components/PrinterStudio';
import { mapUserWithCompatibility } from '@/utils/userMapping';

const Studio = () => {
  const { user, loading } = useAuth();
  const { isPrinter, isCreator } = useUserRole();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{ 
    creator_status?: string; 
    onboarding_completed?: boolean;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
  }>({});

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isCreator) {
      fetchUserProfile();
    }
  }, [user, isCreator]);

  const fetchUserProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('users')
        .select('creator_status, onboarding_completed, full_name_fr, full_name_en, full_name_ty, bio_fr, bio_en, bio_ty, avatar_url')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }

      if (data) {
        // Mapper avec compatibilité
        const mappedData = mapUserWithCompatibility(data);
        setUserProfile({
          creator_status: data.creator_status,
          onboarding_completed: !!data.onboarding_completed,
          full_name: mappedData.full_name,
          bio: mappedData.bio,
          avatar_url: data.avatar_url
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Redirection vers l'onboarding si nécessaire
  if (isCreator && (!userProfile.onboarding_completed || !userProfile.full_name || !userProfile.bio || !userProfile.avatar_url)) {
    navigate('/creator-onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        {isPrinter ? <PrinterStudio /> : <CreatorStudio />}
      </div>
    </div>
  );
};

export default Studio;
