import { Session, User } from "@supabase/supabase-js";
export interface IUser {
  id?: string;
  name?: string;
  last_name?: string;
  image_url?: string;
  role: "waiter" | "chef" | "admin";
}

export interface ICustomer {
  id?: string;
  full_name: string;
  total_orders: number;
  total_free_orders: number;
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
export interface ICustomerContextProvider {
  loading: boolean;
  deleteCustomer: (id: string) => void;
  getCustomerById: (id: string) => void;
  getCustomers: () => void;
  customers: ICustomer[];
  customer: ICustomer;
}
