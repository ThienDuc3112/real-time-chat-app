import { ReactNode, useRef } from "react";

const PopupDialog = ({
    children,
    open,
    onClose,
    width,
    height,
}: {
    children: ReactNode;
    open: boolean;
    onClose: () => void;
    width?: string;
    height?: string;
}) => {
    const ref = useRef<HTMLDialogElement>(null);
    return (
        <div
            id="overlay"
            className="bg-gray-500 bg-opacity-85 fixed inset-0 flex items-center justify-items-center p-4 z-10"
            style={open ? {} : { display: "none" }}
            onClick={(e) => {
                if ((e.target as unknown as { id?: string }).id != "overlay") return;
                onClose();
            }}
        >
            <dialog
                id="dialog"
                ref={ref}
                open={open}
                className="bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full"
                style={
                    open ? {} : { display: "none" }
                }
            >
                <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
                    {children}
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button onClick={() => {
                            onClose()
                        }} className="items-center whitespace-nowrap ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default PopupDialog;
