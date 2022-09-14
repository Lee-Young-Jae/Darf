import React from "react";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_LOGOUT_REQUEST } from "../modules/reducers/user";
const { SubMenu } = Menu;

const AppMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);

  const onLogout = () => {
    dispatch({
      type: USER_LOGOUT_REQUEST,
      data: me.id,
    });
  };

  return (
    <Menu mode="horizontal">
      <Menu.Item
        key="DARF"
        onClick={() => {
          navigate("/");
        }}
      >
        DARF
      </Menu.Item>
      <Menu.Item
        key="setting:1"
        onClick={() => {
          navigate("/healthstate");
        }}
      >
        Calendar
      </Menu.Item>

      <Menu.Item
        key="Group"
        onClick={() => {
          navigate("/group");
        }}
      >
        Group
      </Menu.Item>
      <Menu.Item
        key="MyPage"
        onClick={() => {
          navigate("/profile/1");
        }}
      >
        Mypage
      </Menu.Item>
      {me?.userEmail ? (
        <Menu.Item key="logout" onClick={onLogout}>
          Logout
        </Menu.Item>
      ) : (
        <Menu.Item
          key="login"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </Menu.Item>
      )}
    </Menu>
  );
};

export default AppMenu;
