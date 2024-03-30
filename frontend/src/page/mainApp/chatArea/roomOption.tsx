import { useContext } from "react";
import { RoomContext } from "../../../context/room/roomContext";

const RoomOption = ({ open, closeHandler, openEditRoom, roomId }: { roomId: string, open: boolean, closeHandler: () => void, openEditRoom: () => void }) => {
    const { deleteRoom } = useContext(RoomContext)
    return <div id="roomOptionsBackground" onClick={e => {
        if ((e.target as unknown as { id: string | undefined }).id == "roomOptionsBackground") {
            closeHandler()
        }
    }} className="z-10 opacity-100 h-full w-full fixed top-0 left-0"
        style={open ? {} : { display: "none" }}
    >
        <div id="roomOptions" className="bg-white border border-gray-300 rounded absolute z-20 right-5 p-3 top-14">
            <ul className="w-full h-full">
                <li className="flex items-center hover:bg-gray-100 hover:cursor-pointer p-1 m-1" onClick={() => { closeHandler(); openEditRoom() }}><PencilIcon className="mr-2 h-4 w-4 flex-shrink-0" />Edit name</li>
                <li className="flex items-center hover:bg-gray-100 hover:cursor-pointer p-1 m-1" onClick={() => { deleteRoom(roomId).then(success => alert(success ? "Room deleted" : "Failed to delete room")).finally(() => closeHandler()) }}><TrashIcon className="mr-2 h-4 w-4 flex-shrink-0" />Delete room</li>
            </ul>
        </div>
    </div>
}

export default RoomOption


function PencilIcon(props: { className?: string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    )
}


function TrashIcon(props: { className?: string }) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    )
}
