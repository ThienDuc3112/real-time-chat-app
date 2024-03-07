const InvitePopup = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <dialog open={open}>
      <button
        onClick={() => {
          onClose();
        }}
      >
        close
      </button>
    </dialog>
  );
};

export default InvitePopup;
