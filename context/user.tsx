import * as React from "react";
import { createContext, useContext } from "react";
import { supabase } from "@/utils/supabase";
import { IUser, IUserContextProvider } from "@/interfaces";

export const UserContext = createContext<IUserContextProvider>({
  getUserById: async (id: string): Promise<IUser> => ({} as IUser),
});

export const UserContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  //DOCS: Use this with a state on the component that wants to consume Ex. [user, setUser]
  async function getUserById(id: string) {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    return data;
  }
  return (
    <UserContext.Provider
      value={{
        getUserById,
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
