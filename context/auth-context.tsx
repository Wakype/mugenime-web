"use client";

import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/client";

export interface ExtendedUser extends User {
  role?: string;
  db_full_name?: string;
  db_avatar_url?: string;
}

export interface Profile {
  id?: string;
  role?: string;
  full_name?: string | null;
  avatar_url?: string | null;
}

interface AuthContextType {
  user: ExtendedUser | null;
  profile: Profile | null;
  isAuthLoading: boolean;
  loginWithGoogle: (nextUrl?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const fetchProfileAndSetUser = async (sessionUser: User | null) => {
    if (!sessionUser) {
      setUser(null);
      setProfile(null);
      setIsAuthLoading(false);
      return;
    }

    try {
      const { data: dbProfile } = await supabase
        .from("profiles")
        .select("role, full_name, avatar_url")
        .eq("id", sessionUser.id)
        .maybeSingle();

      const userRole = dbProfile?.role || "user";
      const fullName =
        dbProfile?.full_name || sessionUser.user_metadata?.full_name;
      const avatarUrl =
        dbProfile?.avatar_url || sessionUser.user_metadata?.avatar_url;

      setProfile(dbProfile || null);
      setUser({
        ...sessionUser,
        role: userRole,
        db_full_name: fullName,
        db_avatar_url: avatarUrl,
      });
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setUser({
        ...sessionUser,
        role: "user",
        db_full_name: sessionUser.user_metadata?.full_name,
        db_avatar_url: sessionUser.user_metadata?.avatar_url,
      });
    } finally {
      setIsAuthLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Initial session load
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        if (isMounted) {
          fetchProfileAndSetUser(session?.user || null);
        }
      })
      .catch((err) => {
        console.error("Error getting session in AuthProvider:", err);
        if (isMounted) setIsAuthLoading(false);
      });

    // Auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        fetchProfileAndSetUser(session?.user || null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  const loginWithGoogle = async (nextUrl?: string) => {
    const targetNext =
      nextUrl ||
      globalThis.location.pathname + globalThis.location.search;
    const redirectOrigin = globalThis.location.origin;

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${redirectOrigin}/auth/callback?next=${encodeURIComponent(
          targetNext
        )}`,
      },
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (user) {
      await fetchProfileAndSetUser(user);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthLoading,
        loginWithGoogle,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
