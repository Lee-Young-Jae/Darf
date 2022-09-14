import React from "react";

const Modal = ({
  closeAction,
  okAction,
  innerContents,
  closeMessage = "close",
  okMessage,
}) => {
  return (
    <div className="modalComponent modalBackground" onClick={closeAction}>
      <div
        className="modalBody"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {innerContents}
        <footer>
          {okMessage ? (
            <>
              <button onClick={closeAction}>{closeMessage}</button>
              <button onClick={okAction}>{okMessage}</button>
            </>
          ) : (
            <button onClick={closeAction}>{closeMessage}</button>
          )}
        </footer>
      </div>
    </div>
  );
};

export default Modal;
