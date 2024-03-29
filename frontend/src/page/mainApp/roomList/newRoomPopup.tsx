import { FormEventHandler, useContext, useState } from "react";
import PopupDialog from "../../../component/popupDialog";
import { RoomContext } from "../../../context/room/roomContext";

export const NewRoomPopup = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const [name, setName] = useState("");
    const {createRoom} = useContext(RoomContext)
    const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        createRoom(name).then(success => {
            if (success) {
                alert("Room created")
                setName("")
                onClose()
            } else {
                alert("Unable to create room")
            }
        })
    }
    return <PopupDialog onClose={() => {
        setName("");
        onClose();
    }} open={open}>
        <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3
                        className="text-lg leading-6 font-medium text-gray-900"
                        id="modal-headline"
                    >
                        Create room
                    </h3>
                    <form onSubmit={submitHandler} className="mt-2 flex w-full items-center space-x-2">
                        <input
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Enter the room name"
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                        <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/80 h-10 px-4 py-2">
                            Create
                        </button>
                    </form>
                </div>
            </div>
        </div>
    </PopupDialog>
    return (
        <PopupDialog open={open} onClose={onClose}>
            <p>Create a new room</p>
            <form onSubmit={submitHandler}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    name="name"
                    placeholder="Room name"
                />
                <button type="submit">create</button>
            </form>
        </PopupDialog>
    );
};
