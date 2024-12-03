export interface IUser {
  id?: string;
  name?: string;
  username: string;
  password: string;
}

export interface IUserContextProvider {
  getUserById: (id: string) => Promise<IUser>;
}
