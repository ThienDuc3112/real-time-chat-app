import { useContext } from "react";
import { FriendContext } from "./friendsContext";

export const useUsersContext = () => useContext(FriendContext);
