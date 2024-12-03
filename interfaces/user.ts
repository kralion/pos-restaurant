export interface IUser {
  id?: string;
  name?: string;
  username: string;
  password: string;
  role: "waiter" | "chef" | "admin";
}

export interface IUserContextProvider {
  getUserById: (id: string) => Promise<IUser>;
  user: IUser;
  setUserLogout: () => void;
}
