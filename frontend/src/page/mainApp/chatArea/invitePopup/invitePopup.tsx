import { MouseEventHandler, useState } from "react";
import PopupDialog from "../../../../component/popupDialog";

const InvitePopup = ({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) => {
    const [range, setRange] = useState("")
    const getRangeInput: MouseEventHandler<HTMLInputElement> = (e) => {
        setRange((e.target as unknown as {value: string}).value)
    }
    return (
        <PopupDialog onClose={onClose} open={open}>
            <p>Configure your invite link</p>
            <form>
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

            </form>
        </PopupDialog>
    );
};

export default InvitePopup;
