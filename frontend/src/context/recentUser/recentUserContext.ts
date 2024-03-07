import { createContext } from "react";
import { IUser } from "../../types/IUser";

export const RecentUserContext = createContext({
  recentUsers: [],
  addUser: () => {},
} as { recentUsers: IUser[]; addUser: (user: IUser) => void });
