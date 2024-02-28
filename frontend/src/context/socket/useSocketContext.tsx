import { useContext } from "react";
import { SocketContext } from "./socketContext";

export const useSocketContext = () => useContext(SocketContext);
