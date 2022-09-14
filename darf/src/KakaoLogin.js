import { message } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { KAKAO_LOGIN_REQUEST } from "./modules/reducers/user";

const KakaoLogin = () => {
  const dispatch = useDispatch();
  const { me } = useSelector((state) => state.user);
  //카카오 로그인 인가코드
  // let code = new URL(window.location.href).searchParams.get("code");

  useEffect(() => {
    dispatch({
      type: KAKAO_LOGIN_REQUEST,
      // data: code,
    });
  }, [dispatch]);

  const navigate = useNavigate();
  useEffect(() => {
    if (me?.userEmail) {
      message.success("카카오 로그인 성공!");
      navigate("/");
    }
  }, [me, navigate]);
  return <div>카카오 로그인 중...</div>;
};

export default KakaoLogin;
