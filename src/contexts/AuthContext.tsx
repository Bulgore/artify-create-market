
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { AuthContextType } from '@/types/auth';
import { 
  fetchUserRole, 
  createUserProfile, 
  signUpUser, 
  signInUser, 
  signOutUser 
} from '@/services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [initializing, setInitializing] = useState(true);
  const [roleLoaded, setRoleLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let roleTimeout: NodeJS.Timeout;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Initializing auth...');
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('📝 Current session:', { 
            hasSession: !!currentSession, 
            userEmail: currentSession?.user?.email,
            userId: currentSession?.user?.id 
          });
          
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            // Délai pour éviter les appels simultanés et permettre la stabilisation
            roleTimeout = setTimeout(async () => {
              if (mounted) {
                console.log('🔍 Fetching user role for:', currentSession.user.id);
                try {
                  const role = await fetchUserRole(currentSession.user.id);
                  console.log('✅ Role fetched successfully:', role);
                  if (mounted) {
                    setUserRole(role);
                    setRoleLoaded(true);
                  }
                } catch (error) {
                  console.error('❌ Error fetching role:', error);
                  if (mounted) {
                    setUserRole('créateur'); // Fallback par défaut
                    setRoleLoaded(true);
                  }
                }
              }
            }, 200);
          } else {
            setRoleLoaded(true);
          }
          
          setInitializing(false);
        }
      } catch (error) {
        console.error('❌ Error initializing auth:', error);
        if (mounted) {
          setInitializing(false);
          setLoading(false);
          setRoleLoaded(true);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, newSession: Session | null) => {
        if (!mounted) return;
        
        console.log("🔄 Auth state changed:", { 
          event, 
          hasSession: !!newSession, 
          userEmail: newSession?.user?.email,
          userId: newSession?.user?.id,
          currentUserId: user?.id 
        });
        
        // Éviter les mises à jour redondantes
        if (newSession?.user?.id === user?.id && event !== 'SIGNED_OUT') {
          console.log('⏭️ Skipping redundant auth state change');
          return;
        }
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setRoleLoaded(false);
        
        if (newSession?.user) {
          if (event === 'SIGNED_UP') {
            try {
              console.log('👤 Creating user profile for new signup');
              await createUserProfile(
                newSession.user.id, 
                newSession.user.email || '', 
                newSession.user.user_metadata?.full_name || '', 
                newSession.user.user_metadata?.role || 'créateur'
              );
            } catch (error) {
              console.error('❌ Error creating user profile:', error);
            }
          }
          
          // Délai pour éviter les appels simultanés
          roleTimeout = setTimeout(async () => {
            if (mounted) {
              console.log('🔍 Fetching role after auth change for:', newSession.user.id);
              try {
                const role = await fetchUserRole(newSession.user.id);
                console.log('✅ Role after auth change:', role);
                if (mounted) {
                  setUserRole(role);
                  setRoleLoaded(true);
                }
              } catch (error) {
                console.error('❌ Error fetching role after auth change:', error);
                if (mounted) {
                  setUserRole('créateur'); // Fallback par défaut
                  setRoleLoaded(true);
                }
              }
            }
          }, 300);
        } else {
          setUserRole(null);
          setRoleLoaded(true);
        }
      }
    );

    initializeAuth();

    return () => {
      mounted = false;
      if (roleTimeout) {
        clearTimeout(roleTimeout);
      }
      subscription?.unsubscribe();
    };
  }, []); // Dépendances vides pour éviter les boucles

  // Mettre à jour loading basé sur l'état de roleLoaded
  useEffect(() => {
    if (!initializing && roleLoaded) {
      console.log('✅ Auth fully loaded:', { 
        hasUser: !!user, 
        userRole, 
        roleLoaded 
      });
      setLoading(false);
    }
  }, [initializing, roleLoaded, user, userRole]);

  // Create secure role checkers
  const isAdmin = () => {
    const role = userRole;
    const result = role === 'admin' || role === 'superAdmin';
    console.log('🔐 isAdmin check:', { role, result });
    return result;
  };

  const isSuperAdmin = () => {
    const result = userRole === 'superAdmin';
    console.log('🔐 isSuperAdmin check:', { userRole, result });
    return result;
  };

  const isImprimeur = () => {
    return userRole === 'imprimeur';
  };

  const isCreateur = () => {
    return userRole === 'créateur';
  };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'créateur') => {
    await signUpUser(email, password, fullName, role);
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      await signInUser(email, password);
    } catch (error) {
      setLoading(false);
      throw error;
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
      setRoleLoaded(false);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    userRole,
    signUp,
    signIn,
    signOut,
    isAdmin,
    isSuperAdmin,
    isImprimeur,
    isCreateur
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
