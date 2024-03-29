const ChatRoomCard = ({
    name,
    id,
    setFocus,
    checked,
}: {
    name: string;
    id: string;
    setFocus: (id: string) => void;
    checked: boolean;
}) => {
    return (
        <li>
            <input type="radio" name="rooms" id={name} checked={checked} className="hidden peer"
                onChange={() => {
                    setFocus(id);
                    return;
                }}
            />
            <label
                htmlFor={name}
                className="peer-checked:bg-blue-500 peer-checked:text-white peer-checked:font-semibold inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-gray-200 hover:text-accent-foreground h-10 px-4 py-2 justify-start text-left w-full"
            >
                {name}
            </label>
        </li>
    );
};

export default ChatRoomCard;
