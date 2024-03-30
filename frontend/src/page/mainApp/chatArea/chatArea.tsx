import Input from "./input";
import MessageBubble from "./messageBubble";
import { IRoom } from "../../../types/IRoom";
import { IMessage } from "../../../types/IMessage";
import TopBar from "./topBar";

const ChatArea = ({
    room,
    messages,
}: {
    room: IRoom | undefined;
    messages: IMessage[];
}) => {
    return (
        <section className="flex flex-col h-dvh">
            <TopBar room={room} />
            <div dir="ltr" className="overflow-hidden h-full flex-1 p-4 space-y-4 overflow-y-scroll">
                {messages.map((msg) => (
                    <MessageBubble message={msg} key={msg.id} />
                ))}
            </div>
            <div className="p-4 border-t">
                <Input focus={room?.id} />
            </div>
        </section>
    );
};

export default ChatArea;
