import { useState } from "react"
import InvitePopup from "./invitePopup";

const Topbar = ({focus}:{focus: string | undefined}) => {
    const [open, setOpen] = useState(false);
    return <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">Rooms</h1>
        <button
            className="inline-flex items-center justify-center whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            disabled={focus == undefined}
            onClick={() => setOpen(true)}
        >
            Create invite code
        </button>
        {focus && <InvitePopup open={open} onClose={() => setOpen(false)} roomId={focus} />}
    </div>
}

export default Topbar
