import { useState } from "react";
import { IRoom } from "../../../types/IRoom";
import RoomOption from "./roomOption";
import EditRoomNamePopup from "./editRoomPopup";

const TopBar = ({ room }: { room: IRoom | undefined }) => {
    const [open, setOpen] = useState(false)
    const [openEditName, setOpenEditName] = useState(false)
    return (
        <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-xl font-semibold">{room?.name ?? "Select a room"}</h2>
            <button
                onClick={() => setOpen(true)}
                disabled={room == undefined || (room.role != "owner" && room.role != "moderator")}
                className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-10 hover:bg-gray-200 rounded-full p-2"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={24}
                    height={24}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <circle cx={12} cy={12} r={1} />
                    <circle cx={19} cy={12} r={1} />
                    <circle cx={5} cy={12} r={1} />
                </svg>
                <span className="sr-only">More</span>
            </button>
            <RoomOption roomId={room ? room.id : ""} closeHandler={() => setOpen(false)} open={open} openEditRoom={() => setOpenEditName(true)} />
            <EditRoomNamePopup roomId={room ? room.id : ""} open={openEditName} closeHandler={() => setOpenEditName(false)} />
        </div>
    );
};

export default TopBar;
