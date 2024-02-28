import { useEffect, useMemo, useState } from "react";
import ChatArea from "./chatArea/chatArea";
import ChatRoomList from "./roomList/chatRoomList";
import { API_URL } from "../constants";
import { getAccessToken } from "../util/getAccessToken";
import { get } from "../util/fetch";
import { IRoom } from "../types/IRoom";
import { IMessage } from "../types/IMessage";
import style from "./mainPage.module.css";
import { useSocketContext } from "../context/socket/useSocketContext";
import { SocketContextProvider } from "../context/socket/socketContextProvider";

const MainPage = () => {
  const socket = useSocketContext();
  const [rooms, setRooms] = useState({} as { [keys: string]: IRoom });
  const [msgs, setMsgs] = useState([] as IMessage[]);
  const [focus, setFocus] = useState(undefined as string | undefined);
  const roomMsg = useMemo(() => {
    return msgs.filter((msg) => msg.roomId == focus);
  }, [msgs, focus]);
  useEffect(() => {
    if (!focus || !rooms[focus]) return;
    (async () => {
      const token = await getAccessToken();
      if (!rooms[focus].updated) {
        const [messages, err] = await get<IMessage[]>(
          `${API_URL}/room/getroommessages/${focus}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (!err) {
          setMsgs((prev) => [...prev, ...messages]);
        }
        setRooms((prev) => ({
          ...(prev ?? {}),
          [focus]: { ...rooms[focus], updated: true },
        }));
      }
    })();
  }, [focus]);
  useEffect(() => {
    (async () => {
      const token = await getAccessToken();
      const [data, err] = await get<{ id: string; name: string }[]>(
        `${API_URL}/room/getallroom`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!err) {
        const newRooms: { [keys: string]: IRoom } = {};
        data.forEach((room) => {
          newRooms[room.id] = {
            id: room.id,
            name: room.name,
          };
        });
        setRooms(newRooms);
      }
      socket?.emit("joinAllRoom", token);
    })();
    socket.on("error", (error: unknown) => {
      console.log(error);
    });
    socket.on("incomingMessage", (msg: IMessage) => {
      setMsgs((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("incomingMessage");
      socket.off("error");
    };
  }, []);
  return (
    <SocketContextProvider>
      <div className={style.container}>
        <ChatRoomList rooms={rooms} setFocus={setFocus} />
        <ChatArea room={rooms[`${focus}`]} messages={roomMsg} />
      </div>
    </SocketContextProvider>
  );
};

export default MainPage;
