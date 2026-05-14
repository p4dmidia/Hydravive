import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface UserProfile {
  id: number;
  role: 'affiliate' | 'admin' | 'customer';
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  cpf?: string;
  pix_key?: string;
  pix_type?: string;
  referral_code?: string;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  fetchProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar o perfil de forma isolada
  const fetchProfile = async (userId?: string, retries = 3) => {
    const id = userId || session?.user?.id || user?.id;
    const email = user?.email || session?.user?.email;
    if (!id) return;
    
    try {
      console.log(`AuthContext: 🔍 Buscando perfil (Fura-Bloqueio)...`);
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/user_profiles?mocha_user_id=eq.${id}&select=*`, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${session?.access_token || import.meta.env.VITE_SUPABASE_ANON_KEY}`
        }
      });

      const data = await response.json();

      if (data && data.length > 0) {
        console.log('AuthContext: ✅ Perfil encontrado:', data[0].full_name);
        setProfile(data[0] as any);
      } else if (retries > 0) {
        console.log(`AuthContext: ⚠️ Tentando novamente... (${retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await fetchProfile(id, retries - 1);
      }
    } catch (err) {
      console.error('AuthContext: Erro na busca nativa:', err);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      // Simplesmente escuta as mudanças de auth
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth Event:', event, !!session);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        }
        setLoading(false);
      });

      // Tenta pegar a sessão inicial sem travar nada
      const { data: { session: s } } = await supabase.auth.getSession();
      if (s && mounted) {
        setSession(s);
        setUser(s.user);
        fetchProfile(s.user.id);
      }
      setLoading(false);
    }

    initialize();

    // Ouvinte de mudanças de estado (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (mounted) {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
