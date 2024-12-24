import { IAuthContextProvider, IUser } from "@/interfaces";
import { supabase } from "@/utils/supabase";
import { supabaseAdmin } from "@/utils/supabaseAdmin";
import { FontAwesome } from "@expo/vector-icons";
import { Session, User } from "@supabase/supabase-js";
import { createContext, useContext, useState } from "react";
import { Alert } from "react-native";
import { toast } from "sonner-native";

const AuthContext = createContext<IAuthContextProvider>({
  session: null,
  user: null,
  isAuthenticated: false,
  signOut: async () => {},
  updateProfile: async () => {},
  getProfile: async () => {},
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
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<IUser | null>(null);
  const [users, setUsers] = useState<IUser[]>([]);

  const getProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("accounts")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) throw console.log("PROFILE ERROR", error);
      setProfile(data);
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert("Profile Fetch Error", error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  async function signOut() {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
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

      if (error) {
        toast.error("Error al eliminar usuario!", {
          icon: <FontAwesome name="times-circle" size={20} color="red" />,
        });
        return;
      }
      toast.success("Usuario eliminado!", {
        icon: <FontAwesome name="check-circle" size={20} color="green" />,
      });

      setUsers(users.filter((user) => user.id !== id));
    } catch (err: any) {
      alert("Error deleting user: " + err.message);
    }
  };

  const getUsers = async (id_tenant: string) => {
    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id_tenant", id_tenant)
      .order("name");
    if (error) throw error;
    setUsers(data);
    return data;
  };

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
        getProfile,
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
