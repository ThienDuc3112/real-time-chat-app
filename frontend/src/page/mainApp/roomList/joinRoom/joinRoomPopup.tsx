import { FormEventHandler, useContext, useState } from "react";
import PopupDialog from "../../../../component/popupDialog";
import { RoomContext } from "../../../../context/room/roomContext";

export const JoinRoomPopup = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const [id, setId] = useState("")
    const {joinRoom} = useContext(RoomContext)
    const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        joinRoom(id).then(success => {
            if (success) {
                alert("You have joined room")
                setId("")
                onClose()
            } else {
                alert("Invalid room id/invite link")
            }
        })
    }
    return <PopupDialog onClose={() => {
        setId("");
        onClose();
    }} open={open}>
        <form onSubmit={onSubmit}>
            <input type="text" value={id} onChange={(e) => setId(e.target.value)} placeholder="Id or invite link" />
            <button type="submit">Join</button>
        </form>
    </PopupDialog>
}
