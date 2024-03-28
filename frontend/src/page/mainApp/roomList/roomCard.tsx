const ChatRoomCard = ({
    name,
    id,
    setFocus,
}: {
    name: string;
    id: string;
    setFocus: (id: string) => void;
}) => {
    return (
        <button
            className="inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 justify-start text-left w-full"
            onClick={() => {
                setFocus(id);
                return;
            }}
        >
            {name}
        </button>
    );
};

export default ChatRoomCard;
