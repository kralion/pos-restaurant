import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase";
import { IUser, IUserContextProvider } from "@/interfaces";
import { router } from "expo-router";

export const UserContext = createContext<IUserContextProvider>({
  getUserById: async (id: string): Promise<IUser> => ({} as IUser),
  setUserLogout: () => {},
  user: {} as IUser,
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = React.useState<IUser>({} as IUser);
  async function getUserById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    setUser(data);
    return data;
  }

  async function setUserLogout() {
    setUser({} as IUser);
    router.push("/(auth)/login");
  }
  return (
    <UserContext.Provider
      value={{
        getUserById,
        user,
        setUserLogout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};
