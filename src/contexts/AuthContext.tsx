import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { 
  fetchUserRole, 
  createUserProfile, 
  signUpUser, 
  signInUser, 
  signOutUser 
} from '@/services/authService';
import { createRoleCheckers } from '@/utils/roleUtils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Configuration initiale
    const initializeAuth = async () => {
      try {
        // Récupérer la session actuelle
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            const role = await fetchUserRole(currentSession.user.id);
            if (mounted) {
              setUserRole(role);
            }
          }
          
          setInitializing(false);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        if (mounted) {
          setInitializing(false);
          setLoading(false);
        }
      }
    };

    // Listener pour les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        if (!mounted) return;
        
        console.log("Auth state changed:", event, newSession?.user?.email);
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Créer le profil si nécessaire (uniquement lors de l'inscription)
          if (event === 'SIGNED_UP') {
            await createUserProfile(
              newSession.user.id, 
              newSession.user.email || '', 
              newSession.user.user_metadata?.full_name || '', 
              newSession.user.user_metadata?.role || 'créateur'
            );
          }
          
          // Récupérer le rôle
          setTimeout(async () => {
            if (mounted) {
              const role = await fetchUserRole(newSession.user.id);
              if (mounted) {
                setUserRole(role);
              }
            }
          }, 0);
        } else {
          setUserRole(null);
        }
        
        if (!initializing) {
          setLoading(false);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, fullName: string, role: string = 'créateur') => {
    await signUpUser(email, password, fullName, role);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInUser(email, password);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await signOutUser();
      // Réinitialiser l'état immédiatement
      setUser(null);
      setSession(null);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const roleCheckers = createRoleCheckers(userRole);

  const value = {
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signOut,
    ...roleCheckers
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
