import { Dispatch, useEffect, useState } from "react";
import { getAccessToken } from "../util/getAccessToken";
import { get } from "../util/fetch";
import { API_URL } from "../constants";
import { IUser } from "../types/IUser";

export const useUsers = (): [
  { [username: string]: IUser },
  Dispatch<
    React.SetStateAction<{
      [username: string]: IUser;
    }>
  >
] => {
  const [users, setUsers] = useState({} as { [username: string]: IUser });
  useEffect(() => {
    getAccessToken().then(async (token) => {
      const [data, err] = await get<IUser[]>(`${API_URL}/user/friends`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!err) {
        const initialUsers: { [username: string]: IUser } = {};
        data.forEach((user) => (initialUsers[user.username] = user));
        setUsers(initialUsers);
      }
    });
  }, []);
  return [users, setUsers];
};
