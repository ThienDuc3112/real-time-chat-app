import { ReactNode, useEffect, useState } from "react";
import { getAccessToken } from "../../util/getAccessToken";
import { get } from "../../util/fetch";
import { API_URL } from "../../constants";
import { IUser } from "../../types/IUser";
import { FriendContext } from "./friendsContext";

export const FriendsContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [friends, setFriends] = useState({} as { [username: string]: IUser });
  useEffect(() => {
    getAccessToken().then(async (token) => {
      const [data, err] = await get<IUser[]>(`${API_URL}/user/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!err) {
        const initialUsers: { [username: string]: IUser } = {};
        data.forEach((user) => (initialUsers[user.username] = user));
        setFriends(initialUsers);
      }
    });
  }, []);

  return (
    <FriendContext.Provider value={{ friends, setFriends }}>
      {children}
    </FriendContext.Provider>
  );
};
