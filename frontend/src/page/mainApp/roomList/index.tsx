import ChatRoomCard from "./roomCard";
import NewRoom from "./newRoom";
import { useContext, useEffect } from "react";
import { RoomContext } from "../../../context/room/roomContext";
import Topbar from "./topbar";

const SideBar = ({
    setFocus,
    focus
}: {
    setFocus: (id: string) => void;
    focus: string | undefined
}) => {
    const { rooms } = useContext(RoomContext)
    useEffect(() => {
        console.log("Room updated")
    }, [rooms])
    return (
        <aside className="bg-gray-100 p-4">
            <Topbar focus={focus}/>
            <div className="relative overflow-hidden h-[calc(100vh-160px)] overflow-y-auto">
                <div
                    data-radix-scroll-area-viewport=""
                    className="h-full w-full rounded-[inherit]"
                >
                    <ul className="space-y-2">
                        {Object.keys(rooms).map((roomId) => {
                            const room = rooms[roomId];
                            return (
                                    <ChatRoomCard
                                        name={room.name}
                                        id={room.id}
                                        setFocus={setFocus}
                                        key={room.id}
                                        checked={focus == room.id}
                                    />
                            );
                        })}
                    </ul>
                </div>
            </div>
            <NewRoom />
        </aside>
    );
};

export default SideBar;
