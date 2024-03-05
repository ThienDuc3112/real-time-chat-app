import { ReactNode, useRef } from "react";
import style from "./popupDialog.module.css";

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
    <dialog
      ref={ref}
      open={open}
      style={
        open
          ? {
              display: "grid",
              gridTemplateRows: "35px 1fr",
              width: width ?? "30%",
              minWidth: "200px",
              height: height ?? "80%",
              position: "fixed",
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              border: "solid #A0A0A0 3px",
              padding: 15,
              borderRadius: 15,
            }
          : { display: "none" }
      }
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "row-reverse",
        }}
      >
        <button
          onClick={() => {
            onClose();
          }}
          className={`${style.button} ${style.hover}`}
        >
          Close
        </button>
      </div>
      <div style={{ width: "100%", height: "100%", margin: 0, padding: 0 }}>
        {children}
      </div>
    </dialog>
  );
};

export default PopupDialog;
