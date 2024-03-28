import { FormEventHandler, useState } from "react";
import { socket } from "../../../context/socket";
import { getAccessToken } from "../../../util/getAccessToken";

const Input = ({ focus }: { focus: string }) => {
    const [message, setMessage] = useState("");
    const submitHandler: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        if (message.length == 0) return;
        socket.emit("sendMessage", {
            to: focus,
            content: message,
            accessToken: await getAccessToken(),
        });
        setMessage("");
    };
    return (
        <div className="p-4 border-t">
            <form onSubmit={submitHandler} className="flex">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1 mr-2"
                />
                <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white h-10 px-4 py-2">Send</button>
            </form>
        </div>
    );
};

export default Input;
