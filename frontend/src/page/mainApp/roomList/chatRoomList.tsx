import ChatRoomCard from "./roomCard";
import style from "./chatRoomList.module.css";
import NewRoom from "./newRoom";
import { useContext, useEffect } from "react";
import { RoomContext } from "../../../context/room/roomContext";
import Topbar from "./topbar/topbar";

const ChatRoomList = ({
    setFocus,
}: {
    setFocus: (id: string) => void;
}) => {
    const { rooms } = useContext(RoomContext)
    useEffect(() => {
        console.log("Room updated")
    }, [rooms])
    return (
        <div className={style.sidebar}>
            <Topbar/>
            <div className={style.container}>
                {Object.keys(rooms).map((roomId) => {
                    const room = rooms[roomId];
                    return (
                        <ChatRoomCard
                            name={room.name}
                            id={room.id}
                            setFocus={setFocus}
                            key={room.id}
                        />
                    );
                })}
            </div>
            <NewRoom />
        </div>
    );
};

export default ChatRoomList;
