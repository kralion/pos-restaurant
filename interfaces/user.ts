import { Session } from "@supabase/supabase-js";
export interface IUser {
  id?: string;
  name?: string;
  email: string;
  last_name?: string;
  image_url?: string;
  username: string;
  password: string;
  role: "waiter" | "chef" | "admin";
}

export interface IAuthContextProvider {
  session: Session;
  user: IUser;
  loading: boolean;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<IUser>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getUsers: () => Promise<void>;
  users: IUser[];
}
