import React from "react";

const Modal = ({ handleClose, show, children }) => {
  const showHideClassName = show ? "modal d-block" : "modal d-none";

  return (
    <div className={showHideClassName}>
      <div className="modal-container">
        <a
          onClick={(event) => {
            event.preventDefault();
          }}
          className="modal-close"
          onClick={handleClose}
        >
          {"X"}
        </a>
        <div>{children}</div>
      </div>
    </div>
  );
};

export default Modal;

