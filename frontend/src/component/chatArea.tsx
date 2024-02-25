import { IMessage } from "../types/IMessage";
import MessageBubble from "./messageBubble";

const ChatArea = ({ messages }: { messages: IMessage[] }) => {
    return <div>{
        messages.map(msg => 
            <MessageBubble message={msg} key= {msg.id} />)
        }</div>;
};

export default ChatArea;
