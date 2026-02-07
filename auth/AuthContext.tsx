
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role, AuthContextType } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [recoveryMode, setRecoveryMode] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setRecoveryMode(true);
      }

      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUser = async (sbUser: any) => {
    try {
      // Fetch public profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .single();

      setUser({
        username: profile?.username || sbUser.email?.split('@')[0],
        role: 'user', // Default role, specific space roles handled in data layer
        employeeId: sbUser.id,
        department: profile?.department,
        isAdmin: profile?.is_admin || false,
      });
    } catch (error) {
      console.error("Error mapping user", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signup = async (email: string, password: string, fullName: string, department: string): Promise<void> => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=random`,
          department: department
        }
      }
    });

    if (error) throw error;
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/login`,
    });

    if (error) throw error;
  };

  const updatePassword = async (password: string): Promise<void> => {
    if (!isSupabaseConfigured) throw new Error("Supabase not configured");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  const logout = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setUser(null);
  };

  const updateUser = async (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
      if (updates.username && isSupabaseConfigured) {
        await supabase.from('profiles').update({ username: updates.username }).eq('id', user.employeeId);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, resetPassword, updatePassword, recoveryMode, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
