import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import { useState, useEffect, useCallback } from "react";
import { createContext, useContext } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext<IAuthContextProvider>({
  session: null,
  user: null,
  loading: false,
  signOut: async () => {},
  updateProfile: async () => {},
  deleteUser: async () => {},
  getUsers: async () => {},
  users: [],
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<IUser | null>(null); // user
  const [session, setSession] = useState<Session | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  // Simplified session tracking
  useEffect(() => {
    // Initial session check
    const checkSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession);
    };
    checkSession();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);

        // Clear user when session is null
        if (!newSession) {
          setUser(null);
        }
      }
    );

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Fetch profile when session changes
  useEffect(() => {
    if (session?.user) {
      getProfile();
    }
  }, [session]);

  // Get user profile
  const getProfile = useCallback(async () => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUser(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Profile Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }, [session]);

  // Update profile
  const updateProfile = useCallback(
    async (userData: Partial<IUser>) => {
      try {
        setLoading(true);
        if (!session?.user) throw new Error("No user on the session!");

        const updates = {
          ...userData,
          id: session.user.id,
          updated_at: new Date(),
        };

        const { error } = await supabase.from("users").upsert(updates);

        if (error) {
          throw error;
        }

        // Refresh profile after update
        await getProfile();
      } catch (error) {
        if (error instanceof Error) {
          Alert.alert("Update Error", error.message);
        }
      } finally {
        setLoading(false);
      }
    },
    [session, getProfile]
  );

  // Sign out
  const signOut = useCallback(async () => {
    try {
      setLoading(true);

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      // Clear states - this is now handled by the auth state change listener
      // Navigate to sign-in page
      router.replace("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Sign Out Error", error.message);
      } else {
        Alert.alert("Sign Out Error", "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Get users
  const getUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .neq("role", "admin")
        .order("name");

      if (error) {
        throw error;
      }

      setUsers(data || []);
    } catch (err: any) {
      alert("Error al obtener usuarios: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Delete user
  const deleteUser = useCallback(
    async (id: string) => {
      try {
        const { error } = await supabase.from("users").delete().eq("id", id);

        if (error) throw error;

        setUsers(users.filter((user) => user.id !== id));
      } catch (err: any) {
        alert("Error al eliminar usuario: " + err.message);
      }
    },
    [users]
  );

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        updateProfile,
        signOut,
        deleteUser,
        getUsers,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within a AuthProvider");
  }
  return context;
};
