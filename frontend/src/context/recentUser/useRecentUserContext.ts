import { useContext } from "react";
import { RecentUserContext } from "./recentUserContext";

export const useRecentUserContext = () => useContext(RecentUserContext);
