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
    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
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
    return (
        <PopupDialog open={open} onClose={onClose}>
            <p>Create a new room</p>
            <form onSubmit={onSubmit}>
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
