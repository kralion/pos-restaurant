import { Session, User } from "@supabase/supabase-js";
export interface IUser {
  id?: string;
  name?: string;
  last_name?: string;
  image_url?: string;
  role: "waiter" | "chef" | "admin";
}
export interface IAuthContextProvider {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  profile: IUser;
  loading: boolean;
  signOut: () => void;
  updateProfile: (userData: Partial<IUser>) => void;
  deleteUser: (id: string) => void;
  getUsers: () => void;
  users: IUser[];
}
