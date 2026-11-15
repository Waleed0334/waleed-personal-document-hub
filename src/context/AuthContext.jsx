import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useInactivityTimeout } from '../hooks/useInactivityTimeout';

const AuthContext = createContext(null);

const DEMO_USER = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'waleed@demo.vault',
  user_metadata: {
    full_name: 'Waleed Ahmed Siddiqui (Demo Vault)',
  },
  isDemo: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [timeoutMinutes, setTimeoutMinutes] = useState(() => {
    const saved = localStorage.getItem('vault_timeout_minutes');
    return saved ? parseInt(saved, 10) : 15;
  });

  const configured = isSupabaseConfigured();

  // Inactivity timeout handler
  const handleInactivityLogout = useCallback(() => {
    if (user) {
      console.warn('Auto-logging out due to inactivity');
      logout();
      alert('Your vault session has been securely locked due to inactivity.');
    }
  }, [user]);

  const { isWarningVisible, secondsRemaining, resetTimer } = useInactivityTimeout({
    onTimeout: handleInactivityLogout,
    timeoutMinutes,
    warningSeconds: 60,
    enabled: !!user,
  });

  // Save timeout preference
  const updateTimeoutMinutes = (mins) => {
    setTimeoutMinutes(mins);
    localStorage.setItem('vault_timeout_minutes', mins.toString());
  };

  useEffect(() => {
    if (!configured) {
      // Check if user previously had demo session open
      const savedDemo = sessionStorage.getItem('vault_demo_active');
      if (savedDemo === 'true') {
        setUser(DEMO_USER);
        setIsDemoMode(true);
      }
      setLoading(false);
      return;
    }

    // Get current session from Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [configured]);

  const login = async (email, password) => {
    if (!configured) {
      throw new Error('Supabase is not configured yet. Please configure your .env file or test using Demo Mode.');
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setIsDemoMode(false);
    sessionStorage.removeItem('vault_demo_active');
    return data;
  };

  const loginWithGitHub = async () => {
    if (!configured) {
      throw new Error('Supabase is not configured yet. Please configure your .env file first.');
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return data;
  };

  const signupOwner = async (email, password, fullName = 'Waleed Ahmed Siddiqui') => {
    if (!configured) {
      throw new Error('Supabase is not configured yet. Please configure your .env file first.');
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    try {
      sessionStorage.removeItem('vault_recent_searches');
    } catch {}

    if (isDemoMode) {
      setUser(null);
      setIsDemoMode(false);
      sessionStorage.removeItem('vault_demo_active');
      return;
    }

    if (configured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    sessionStorage.removeItem('vault_demo_active');
  };

  const resetPassword = async (email) => {
    if (!configured) {
      throw new Error('Supabase is not configured yet.');
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  };

  const updatePassword = async (newPassword) => {
    if (isDemoMode) {
      return { message: 'Demo mode: Password updated successfully in session.' };
    }
    if (!configured) {
      throw new Error('Supabase is not configured yet.');
    }
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    if (error) throw error;
    return data;
  };

  const enterDemoMode = () => {
    setUser(DEMO_USER);
    setIsDemoMode(true);
    sessionStorage.setItem('vault_demo_active', 'true');
  };

  const exitDemoMode = () => {
    setUser(null);
    setIsDemoMode(false);
    sessionStorage.removeItem('vault_demo_active');
  };

  const value = {
    user,
    session,
    loading,
    isConfigured: configured,
    isDemoMode,
    timeoutMinutes,
    updateTimeoutMinutes,
    login,
    loginWithGitHub,
    signupOwner,
    logout,
    resetPassword,
    updatePassword,
    enterDemoMode,
    exitDemoMode,
    inactivityWarning: {
      isVisible: isWarningVisible,
      secondsRemaining,
      stayLoggedIn: resetTimer,
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
