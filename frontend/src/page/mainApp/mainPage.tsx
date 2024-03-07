import { useEffect, useState } from "react";
import ChatArea from "./chatArea/chatArea";
import ChatRoomList from "./roomList/chatRoomList";
import { IMessage } from "../../types/IMessage";
import style from "./mainPage.module.css";
import { useRoom } from "../../hook/useRoom";
import { get } from "../../util/fetch";
import { API_URL } from "../../constants";
import { getAccessToken } from "../../util/getAccessToken";
import { socket } from "../../context/socket";

const MainPage = () => {
  const [rooms, updated, setUpdated] = useRoom();
  const [msgs, setMsgs] = useState({} as { [key: string]: IMessage[] });
  const [focus, setFocus] = useState(undefined as string | undefined);
  useEffect(() => {
    socket.on("error", (error: unknown) => {
      console.log(error);
    });
    socket.on("incomingMessage", (msg: IMessage) => {
      setMsgs((prev) => {
        return { ...prev, [msg.roomId]: [...(prev[msg.roomId] ?? []), msg] };
      });
    });
    return () => {
      socket.off("incomingMessage");
      socket.off("error");
    };
  }, []);
  useEffect(() => {
    if (focus == undefined) return;
    if (!updated[`${focus}`]) {
      getAccessToken()
        .then((token) =>
          get<IMessage[]>(`${API_URL}/room/getroommessages/${focus}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
        )
        .then(([data, err]) => {
          if (!err) {
            setMsgs((prev) => ({ ...prev, [`${focus}`]: data }));
            setUpdated((prev) => ({ ...prev, [`${focus}`]: true }));
          }
        });
    }
  }, [focus, updated, setUpdated]);
  return (
    <div className={style.container}>
      <ChatRoomList rooms={rooms} setFocus={setFocus} />
      <ChatArea room={rooms[`${focus}`]} messages={msgs[focus ?? ""] ?? []} />
    </div>
  );
};

export default MainPage;
