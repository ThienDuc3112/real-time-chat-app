import { useEffect, useRef } from "react";
import ChatArea from "./chatArea";
import ChatRoomList from "./chatRoomList";
import { Socket, io } from "socket.io-client";
import { API_URL } from "../constants";

const MainPage = () => {
  const socket = useRef(undefined as Socket | undefined);
  useEffect(() => {
    socket.current = io(`${API_URL}`, {
      protocols: ["websocket"],
    });
    socket.current.emit("joinAllRoom", `Insert access token`);
    socket.current.emit("sendMessage", {
      to: "random room",
      content: "test",
      accessToken: "oasjdfiojoiwaskjdf'aeasp",
    });
    socket.current.on("error", (error: unknown) => {
      console.log(error);
    });
  }, []);
  return (
    <>
      <ChatRoomList />
      <ChatArea />
    </>
  );
};

export default MainPage;
