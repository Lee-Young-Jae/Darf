import React from "react";

const MyButton = ({ onClick, btnType, text }) => {
  const type = [`positive`, `negative`].includes(btnType) ? btnType : "default";
  return (
    <button
      className={["MyButton", `MyButton_${type}`].join(" ")}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default MyButton;
