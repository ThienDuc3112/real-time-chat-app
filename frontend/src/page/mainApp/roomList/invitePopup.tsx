import { FormEventHandler, useState } from "react";
import PopupDialog from "../../../component/popupDialog";
import { post } from "../../../util/fetch";
import { API_URL } from "../../../constants";
import { getAccessToken } from "../../../util/getAccessToken";

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
                alert(`Invite code copied to clipboard\nInvite code is: ${data.id}`)
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
        <PopupDialog onClose={() => {
            setRange("1D")
            onClose()
        }} open={open}>
            <div className="bg-gray-100 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3
                            className="text-lg leading-6 font-medium text-gray-900"
                            id="modal-headline"
                        >
                            Configure your invite code
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-gray-500">
                                Customize the expiry duration for the invite code you are
                                creating.
                            </p>
                        </div>
                        <form onSubmit={submitHandler} className="mt-4">
                            <ul className="flex space-x-2 justify-center">
                                {[
                                    { id: "1D", desc: "1 Day" },
                                    { id: "3D", desc: "3 Days" },
                                    { id: "1W", desc: "1 Week" },
                                    { id: "1M", desc: "1 Month" },
                                    { id: "INF", desc: "Forever" },
                                ].map((inp, index) =>
                                    <li key={index}>
                                        <input type="radio" value={inp.id} id={inp.id} checked={range == inp.id} onChange={e => setRange((e.target as unknown as { value: string }).value)} name="validRange" className="hidden peer" />
                                        <label htmlFor={inp.id} className="bg-white peer-checked:bg-blue-500 peer-checked:text-white inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                                            {inp.desc}
                                        </label>
                                    </li>)
                                }
                            </ul>
                            <div className="mt-4 flex justify-center">
                                <button disabled={disabled} type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-gray-750 h-10 px-4 py-2">
                                    Create!
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PopupDialog>
    );
};

export default InvitePopup;
