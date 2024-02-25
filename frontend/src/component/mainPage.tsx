import { useEffect, useRef, useState } from "react";
import ChatArea from "./chatArea";
import ChatRoomList from "./chatRoomList";
import { Socket, io } from "socket.io-client";
import { API_URL } from "../constants";
import { getAccessToken } from "../util/getAccessToken";
import { get } from "../util/fetch";
import { IRoom } from "../types/IRoom";
import { IMessage } from "../types/IMessage";
import style from "./mainPage.module.css";

const MainPage = () => {
    const socket = useRef(undefined as Socket | undefined);
    const [rooms, setRooms] = useState({} as { [keys: string]: IRoom });
    const [focus, setFocus] = useState(undefined as string | undefined);
    useEffect(() => {
        if (!focus || !rooms[focus]) return;
        const room = rooms[focus];
        (async () => {
            const token = await getAccessToken();
            if (room.messages.length == 0) {
                const [messages, err] = await get<IMessage[]>(`${API_URL}/room/getroommessages/${focus}`, { headers: { Authorization: `Bearer ${token}` } })
                if (!err) {
                    room.messages = messages.map(msg => ({ ...msg, timestamp: new Date(msg.timestamp) }))
                    const newRooms = JSON.parse(JSON.stringify(rooms));
                    newRooms[focus] = room;
                    setRooms(newRooms);
                }
            }
        })()
        console.log(rooms)
    }, [focus])
    useEffect(() => {
        socket.current = io(`${API_URL}`, {
            protocols: ["websocket"],
        });

        (async () => {
            const token = await getAccessToken();
            const [data, err] = await get<{ id: string, name: string }[]>(`${API_URL}/room/getallroom`, {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            if (!err) {
                const newRooms: { [keys: string]: IRoom } = {};
                data.forEach(room => {
                    newRooms[room.id] = {
                        id: room.id,
                        name: room.name,
                        messages: []
                    }
                });
                setRooms(newRooms);
            }
            socket.current?.emit("joinAllRoom", token);
        })()
        socket.current.on("error", (error: unknown) => {
            console.log(error);
        });
    }, []);
    return (
        <div className={style.container}>
            <ChatRoomList rooms={rooms} setFocus={setFocus} />
            <ChatArea messages={focus ? rooms[focus].messages ?? [] : []} />
        </div>
    );
};

export default MainPage;
