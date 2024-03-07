import { Dispatch, createContext } from "react";
import { IUser } from "../../types/IUser";

export const FriendContext = createContext({
  friends: {},
  setFriends: () => {},
} as {
  friends: { [username: string]: IUser };
  setFriends: Dispatch<
    React.SetStateAction<{
      [username: string]: IUser;
    }>
  >;
});
