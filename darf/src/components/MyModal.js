import React from "react";
import MyButton from "./MyButton";
import { Link } from "react-router-dom";

const MyModal = ({ title, message, btnMessage, onClick }) => {
  return (
    <div className="MyModal">
      <div className="ModalForm">
        <div className="ModalTitle">{`${title}`}</div>
        <div className="ModalMessage">{message}</div>

        <div className="ModalMenuList">
          <Link className="ModalMenu" to="/fitness">
            운동
          </Link>
          <Link className="ModalMenu" to="/diet">
            식단
          </Link>
          <Link className="ModalMenu" to="/width">
            체중
          </Link>
        </div>
        <MyButton text="닫기" onClick={onClick}></MyButton>
      </div>
    </div>
  );
};

export default MyModal;
