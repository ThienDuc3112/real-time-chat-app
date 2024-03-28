import { IMessage } from "../../../types/IMessage";

const MessageBubble = ({ message }: { message: IMessage }) => {
  return (
    <div>
      <p className="text-sm">
        <strong>{message.username}</strong>
        {" - "}
        {new Date(message.timestamp).toLocaleDateString()}
      </p>
      <p>{message.content}</p>
    </div>
  );
};

export default MessageBubble;
