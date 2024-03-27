import { FormEventHandler, MouseEventHandler, useState } from "react";
import PopupDialog from "../../../../component/popupDialog";
import { post } from "../../../../util/fetch";
import { API_URL } from "../../../../constants";
import { getAccessToken } from "../../../../util/getAccessToken";

const InvitePopup = ({
    open,
    onClose,
    roomId
}: {
    open: boolean;
    onClose: () => void;
    roomId: string
}) => {
    const [range, setRange] = useState("1D")
    const [disabled, setDisabled] = useState(false)
    const getRangeInput: MouseEventHandler<HTMLInputElement> = (e) => {
        setRange((e.target as unknown as { value: string }).value)
    }
    const submitHandler: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault()
        setDisabled(true);
        (async () => {
            const token = await getAccessToken()
            let duration = 1000 * 3600 * 24;
            switch (range) {
                case "3D": {
                    duration *= 3;
                    break;
                }
                case "1W": {
                    duration *= 7;
                    break;
                }
                case "1M": {
                    duration *= 30;
                    break;
                }
                case "INF": {
                    duration *= 0;
                    break;
                }
            }
            const [data, err] = await post<{ roomId: string, id: string, validTill: Date }>(`${API_URL}/room/invite`, {
                headers: {
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${token}`

                },
                body: JSON.stringify({ roomId: roomId.toString(), validFor: duration })
            })
            if (!err) {
                navigator.clipboard.writeText(data.id)
                alert("Invite code copied to clipboard")
                onClose()
                return
            } else {
                console.error(err);
                alert(err);
                return
            }
        })().finally(() => setDisabled(false))
    }
    return (
        <PopupDialog onClose={onClose} open={open}>
            <p>Configure your invite link</p>
            <form onSubmit={submitHandler}>
                <div>
                    <input type="radio" checked={range == "1D"} name="validRange" onClick={getRangeInput} value="1D" id="1D" />
                    <label htmlFor="1D">1 Day</label>
                    <input type="radio" checked={range == "3D"} name="validRange" onClick={getRangeInput} value="3D" id="3D" />
                    <label htmlFor="3D">3 Days</label>
                    <input type="radio" checked={range == "1W"} name="validRange" onClick={getRangeInput} value="1W" id="1W" />
                    <label htmlFor="1W">1 Week</label>
                    <input type="radio" checked={range == "1M"} name="validRange" onClick={getRangeInput} value="1M" id="1M" />
                    <label htmlFor="1M">1 Month</label>
                    <input type="radio" checked={range == "INF"} name="validRange" onClick={getRangeInput} value="INF" id="INF" />
                    <label htmlFor="INF">No expiry</label>
                </div>
                <button type="submit" disabled={disabled}>Create!</button>
            </form>
        </PopupDialog>
    );
};

export default InvitePopup;
