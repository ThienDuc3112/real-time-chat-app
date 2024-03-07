import { ReactNode, useCallback, useState } from "react";
import { RecentUserContext } from "./recentUserContext";
import { IUser } from "../../types/IUser";

export const RecentUserContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentUsers, setRecentUsers] = useState([] as IUser[]);
  const addUser = useCallback((user: IUser) => {
    setRecentUsers((prev) => [
      user,
      ...prev.filter((u) => u.id != user.id).slice(0, 29),
    ]);
  }, []);
  return (
    <RecentUserContext.Provider value={{ recentUsers, addUser }}>
      {children}
    </RecentUserContext.Provider>
  );
};
