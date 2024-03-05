const InvitePopup = ({ open, onClose }: { open: boolean, onClose: () => any }) => {
    return <dialog open={open}>
        <button onClick={() => {
            onClose();
        }}>close</button>
    </dialog>;
}

export default InvitePopup;
