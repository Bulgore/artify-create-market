import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CreatorStudio from '@/components/CreatorStudio';
import PrinterStudio from '@/components/PrinterStudio';
import { mapUserWithCompatibility } from '@/utils/userMapping';

const Studio = () => {
  const { user, loading, isAdmin, isSuperAdmin } = useAuth();
  const { isPrinter, isCreator } = useUserRole();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<{ 
    creator_status?: string; 
    onboarding_completed?: boolean;
    full_name?: string;
    bio?: string;
    avatar_url?: string;
  }>({});
  const [creatorProductsCount, setCreatorProductsCount] = useState<number | null>(null);
  const [countLoading, setCountLoading] = useState(false);

  // FORCE-UNLOCK: Your user UUID
  const FORCE_UNLOCK_ID = '360bcff2-fa75-4fac-87fa-0be5d7c3184c';

  const forceBypass = user && user.id === FORCE_UNLOCK_ID;

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && isCreator) {
      fetchUserProfile();
      fetchCreatorProductsCount();
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
        // Debug output
        console.log('[DEBUG][Studio] User profile fetched:', {
          onboarding_completed: !!data.onboarding_completed,
          full_name: mappedData.full_name,
          bio: mappedData.bio,
          avatar_url: data.avatar_url,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchCreatorProductsCount = async () => {
    if (!user) return;
    setCountLoading(true);
    try {
      const { count, error } = await supabase
        .from('creator_products')
        .select('id', { count: 'exact', head: true })
        .eq('creator_id', user.id);

      if (error) {
        console.error('Error fetching creator products count:', error);
        setCreatorProductsCount(null);
        return;
      }

      setCreatorProductsCount(count ?? 0);
      // Debug output
      console.log('[DEBUG][Studio] creatorProductsCount:', count ?? 0);
    } catch (error) {
      console.error('Error fetching creator products count:', error);
      setCreatorProductsCount(null);
    } finally {
      setCountLoading(false);
    }
  };

  if (loading || countLoading) {
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

  const isAdminUser = isAdmin() || isSuperAdmin();

  // Debug output for bypass mode
  if (forceBypass) {
    console.warn('[DEBUG][Studio] FORCE-UNLOCK mode enabled for this user (bypass onboarding gating)');
  }

  // LOGIC DEBUG: Show all gating/trigger values (still run for all users, including bypass, for logging)
  console.log('[DEBUG][Studio] re-evaluate access: ', {
    isCreator,
    isAdminUser,
    onboarding_completed: userProfile.onboarding_completed,
    full_name: userProfile.full_name,
    bio: userProfile.bio,
    avatar_url: userProfile.avatar_url,
    creatorProductsCount,
    forceBypass,
    needsOnboarding: isCreator &&
      !isAdminUser &&
      (
        !userProfile.onboarding_completed ||
        !userProfile.full_name ||
        !userProfile.bio ||
        !userProfile.avatar_url ||
        (typeof creatorProductsCount === 'number' && creatorProductsCount < 3)
      )
  });

  // Redirection condition -- apply only if not forceBypass for your UUID
  const requiresCreatorOnboarding =
    isCreator &&
    !isAdminUser &&
    !forceBypass &&
    (
      !userProfile.onboarding_completed ||
      !userProfile.full_name ||
      !userProfile.bio ||
      !userProfile.avatar_url ||
      (typeof creatorProductsCount === 'number' && creatorProductsCount < 3)
    );

  if (requiresCreatorOnboarding) {
    navigate('/creator-onboarding');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {forceBypass && (
        <div className="bg-yellow-100 text-yellow-900 px-4 py-3 border-l-4 border-yellow-500 mb-6">
          <strong>Debug/Safe Mode — Bypass Active:</strong>
          {" "}
          Vous êtes en mode développeur : la règle d'accès à l'onboarding est forçée OFF pour votre utilisateur (UUID: <code>{FORCE_UNLOCK_ID}</code>).
        </div>
      )}
      <div className="container mx-auto py-8">
        {isPrinter ? <PrinterStudio /> : <CreatorStudio />}
      </div>
    </div>
  );
};

export default Studio;
