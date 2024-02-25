import { IRoom } from "../types/IRoom";
import ChatRoomCard from "./chatRoomCard";
import style from "./chatRoomList.module.css";

const ChatRoomList = ({ rooms, setFocus }: {
    rooms: {
        [keys: string]: IRoom
    },
    setFocus: (id: string) => void
}) => {
    return <div className={style.container}>
        {
            Object.keys(rooms).map(roomId => {
                const room = rooms[roomId];
                return <ChatRoomCard name={room.name} id={room.id} setFocus={setFocus} key={room.id} />
            })
        }</div>;
};

export default ChatRoomList;
