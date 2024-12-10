import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";

const AuthContext = createContext<IAuthContextProvider>({
  session: null,
  user: null,
  isAuthenticated: false,
  signOut: async () => {},
  updateProfile: async () => {},
  deleteUser: async () => {},
  getUsers: async () => {},
  users: [],
  profile: {} as IUser,
  loading: false,
});

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, setSession] = useState<Session | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  const fetchUserProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error, status } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", userId)
        .single();

      if (error && status !== 406) throw error;

      if (data) {
        setProfile(data);
        return data;
      }
      return null;
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Profile Fetch Error", error.message);
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial session check and setup
    async function initializeAuth() {
      const {
        data: { session: initialSession },
      } = await supabase.auth.getSession();
      setSession(initialSession);

      // If there's a session, immediately try to fetch the user profile
      if (initialSession?.user) {
        await fetchUserProfile(initialSession.user.id);
      }

      setIsReady(true);
    }

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        if (_event === "SIGNED_OUT") {
          // Clear all user data on sign-out
          setSession(null);
          setProfile(null);
        } else if (newSession?.user) {
          // Handle signed-in state
          setSession(newSession);
          await fetchUserProfile(newSession.user.id);
        }
      }
    );

    // Initialize authentication
    initializeAuth();

    // Cleanup subscription
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }

      // Clear session and profile explicitly
      setSession(null);
      setProfile(null);
    } catch (error) {
      Alert.alert(
        "Sign Out Error",
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async (userData: Partial<IUser>) => {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        ...userData,
        id: session.user.id,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("accounts").upsert(updates);

      if (error) throw error;

      await fetchUserProfile(session.user.id);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Update Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

      if (error) throw error;

      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      alert("Error deleting user: " + err.message);
    }
  };

  const getUsers = async () => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .neq("role", "admin")
      .order("name");

    if (error) throw error;

    setUsers(data);
    return data;
  };

  if (!isReady) {
    return <ActivityIndicator />;
  }

  const user: User | null = session?.user || null;

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile: profile || ({} as IUser),
        user,
        isAuthenticated: !!session?.user,
        signOut,
        updateProfile,
        deleteUser,
        getUsers,
        users,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
