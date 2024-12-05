import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { Session } from "@supabase/supabase-js";
import { router } from "expo-router";
import * as React from "react";
import { createContext, useContext } from "react";
import { Alert } from "react-native";

export const AuthContext = createContext<IAuthContextProvider>({
  session: {} as Session,
  user: {} as IUser,
  loading: false,
  updateProfile: async () => {},
  signOut: async () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loading, setLoading] = React.useState(false);
  const [user, setUser] = React.useState<IUser>({} as IUser);
  const [session, setSession] = React.useState<Session>({} as Session);
  React.useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession();
      setSession(currentSession || ({} as Session));
    };
    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession || ({} as Session));
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("users")
        .select("*")
        .eq("id", session?.user.id)
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
  }

  async function updateProfile(userData: Partial<IUser>) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        ...userData,
        id: session?.user.id,
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
  }
  React.useEffect(() => {
    if (session?.user) {
      getProfile();
    }
  }, [session]);
  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      setUser({} as IUser);
      setSession({} as Session);
      router.replace("/(auth)/login");
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Sign Out Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        loading,
        updateProfile,
        signOut,
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
