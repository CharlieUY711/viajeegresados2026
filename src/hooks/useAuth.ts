"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/services/supabase";
import type { User as AppUser } from "@/types";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

interface AuthState {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
  });

  const fetchProfile = useCallback(async (supabaseUser: SupabaseUser) => {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", supabaseUser.id)
      .single();
    return data as AppUser | null;
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user);
        setState({ user: profile, session, loading: false });
      } else {
        setState({ user: null, session: null, loading: false });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user);
          setState({ user: profile, session, loading: false });
        } else {
          setState({ user: null, session: null, loading: false });
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, [fetchProfile]);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (updates: Partial<AppUser>) => {
    if (!state.user) return;
    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", state.user.id)
      .select()
      .single();
    if (error) throw error;
    setState((prev) => ({ ...prev, user: data }));
    return data;
  };

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    isAuthenticated: !!state.session,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };
}
