import React, { useCallback, useEffect, useRef, useState } from "react";

import { message, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  USER_LOGIN_REQUEST,
  USER_SIGNUP_REQUEST,
} from "./modules/reducers/user";
import { KAKAO_AUTH_URL } from "./util/OAuth";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { signUpDone, signUpError, logInError } = useSelector(
    (state) => state.user.state
  );
  const { me } = useSelector((state) => state.user);

  const [userLoginEmail, setUserLoginEmail] = useState("");
  const [userLoginPassword, setUserLoginPassword] = useState("");
  const [userSignUpEmail, setUserSignUpEmail] = useState("");
  const [userSignUpPassword, setUserSignUpPassword] = useState("");
  const [userSingUpNickname, setUserSignUpNickname] = useState("");
  const [userSignUpConfirmPassword, setUserSignUpConfirmPassword] =
    useState("");
  const [signUpMode, setSignUpMode] = useState(false);

  const loginEmailRef = useRef();
  const loginPasswordRef = useRef();
  const signUpEmailRef = useRef();
  const signUpPasswordRef = useRef();
  const signUpConfirmPasswordRef = useRef();
  const signUpNicknameRef = useRef();

  const $emailLabelRef = useRef();
  const $passwordLabelRef = useRef();
  const $nicknameLabelRef = useRef();
  const $confirmPasswordLabelRef = useRef();

  // ############ onChange ############
  const onChangeLoginEmail = useCallback((e) => {
    setUserLoginEmail(e.target.value);
    $emailLabelRef?.current.classList.remove("warning");
  }, []);

  const onChangeLoginPassword = useCallback((e) => {
    setUserLoginPassword(e.target.value);
    $passwordLabelRef?.current.classList.remove("warning");
  }, []);

  const onChangeSignUpEmail = useCallback((e) => {
    setUserSignUpEmail(e.target.value);
    $emailLabelRef?.current.classList.remove("warning");
  }, []);

  const onChangeSignUpPassword = useCallback((e) => {
    setUserSignUpPassword(e.target.value);
    $passwordLabelRef?.current.classList.remove("warning");
  }, []);

  const onChangeSignUpNickname = useCallback((e) => {
    setUserSignUpNickname(e.target.value);
    $nicknameLabelRef?.current.classList.remove("warning");
  }, []);

  const onChangeConfirmSignUpPassword = useCallback((e) => {
    setUserSignUpConfirmPassword(e.target.value);
    $confirmPasswordLabelRef?.current.classList.remove("warning");
  }, []);

  const togleSignUpMode = useCallback(() => {
    setUserSignUpEmail(userLoginEmail);
    setUserSignUpPassword(userLoginPassword);
    setSignUpMode((prev) => !prev);
  }, [userLoginEmail, userLoginPassword]);

  const submitLogin = (e) => {
    e.preventDefault();

    if (userLoginEmail.length <= 0) {
      loginEmailRef.current.focus();
      $emailLabelRef.current.classList.add("warning");
    }

    if (userLoginPassword.length <= 0) {
      loginPasswordRef.current.focus();
      $passwordLabelRef.current.classList.add("warning");
    }

    dispatch({
      type: USER_LOGIN_REQUEST,
      data: { email: userLoginEmail, password: userLoginPassword },
    });
    // ????????? ???????????? ????????? ???????????? ???????????? ?????? ???
    // loginEmailRef.current.focus();
    // message.error(error);

    // ????????? ???????????? ????????? ??????????????? ????????? ???
    // loginPasswordRef.current.focus();
    // message.error(error);
  };

  const submitSignUp = (e) => {
    e.preventDefault();
    console.log(
      userSignUpEmail,
      userSignUpPassword,
      userSingUpNickname,
      userSignUpConfirmPassword
    );

    if (!userSignUpEmail || userSignUpEmail?.length <= 0) {
      message.error("???????????? ?????? ????????? ?????????..");
      signUpEmailRef.current.focus();
      $emailLabelRef.current.classList.add("warning");
      return;
    }

    if (!userSingUpNickname || userSingUpNickname?.length <= 0) {
      message.error("????????? ?????? ????????????.");
      signUpNicknameRef.current.focus();
      $nicknameLabelRef.current.classList.add("warning");
      return;
    }

    if (!userSignUpPassword || userSignUpPassword?.length <= 0) {
      message.error("???????????? ?????? ???????????? ?????????..");
      signUpPasswordRef.current.focus();
      $passwordLabelRef.current.classList.add("warning");
      return;
    }

    if (userSignUpPassword !== userSignUpConfirmPassword) {
      message.error("??????????????? ????????? ?????????.");
      signUpConfirmPasswordRef.current.focus();
      $confirmPasswordLabelRef.current.classList.add("warning");
      return;
    }

    dispatch({
      type: USER_SIGNUP_REQUEST,
      data: {
        email: userSignUpEmail,
        password: userSignUpPassword,
        nickname: userSingUpNickname,
      },
    });
  };

  useEffect(() => {
    // ????????? ???????????? ????????? ??????????????? ????????? ???
    // loginPasswordRef.current.focus();
    if (logInError) {
      message.warning(logInError);
    }
  }, [logInError]);

  useEffect(() => {
    //????????? ???????????? ?????? ?????? ???????????? ????????? ???
    //????????? ?????? ?????? ???
    if (signUpError) {
      message.warning(signUpError);
      switch (signUpError) {
        case "?????? ???????????? ????????? ?????????.":
          $nicknameLabelRef.current.classList.add("warning");

          break;
        default:
          break;
      }
      return;
    }
  }, [signUpError]);

  useEffect(() => {
    if (me?.userEmail) {
      message.success("????????? ???????????????!");
      navigate("/");
    }
  }, [me, navigate]);

  useEffect(() => {
    if (signUpDone) {
      message.success("?????????????????????!");
      setSignUpMode(false);
    }
  }, [signUpDone, navigate]);

  return (
    <div className="LoginPage">
      <div>
        {signUpMode ? (
          <>
            <section className="signUp-form">
              <h1>Sign Up</h1>
              <form>
                <div className="int-area">
                  <input
                    id="registeId"
                    autoComplete="email"
                    type="text"
                    required
                    onChange={onChangeSignUpEmail}
                    ref={signUpEmailRef}
                    value={userSignUpEmail}
                  ></input>
                  <label
                    className="idLabel"
                    htmlFor="registeId"
                    ref={$emailLabelRef}
                  >
                    ????????? ??????
                  </label>
                </div>
                <div className="int-area">
                  <input
                    id="nickname"
                    autoComplete="email"
                    type="text"
                    required
                    onChange={onChangeSignUpNickname}
                    ref={signUpNicknameRef}
                    value={userSingUpNickname}
                  ></input>
                  <label
                    className="idLabel"
                    htmlFor="nickname"
                    ref={$nicknameLabelRef}
                  >
                    ????????? ??????
                  </label>
                </div>
                <div className="int-area">
                  <input
                    type="password"
                    name="registePassword"
                    id="registePassword"
                    autoComplete="off"
                    required
                    onChange={onChangeSignUpPassword}
                    ref={signUpPasswordRef}
                    value={userSignUpPassword}
                  ></input>
                  <label
                    className="registePassword"
                    htmlFor="registePassword"
                    ref={$passwordLabelRef}
                  >
                    PASSWORD
                  </label>
                </div>
                <div className="int-area">
                  <input
                    type="password"
                    name="confirmPassword"
                    id="confirmPassword"
                    autoComplete="off"
                    required
                    onChange={onChangeConfirmSignUpPassword}
                    ref={signUpConfirmPasswordRef}
                    value={userSignUpConfirmPassword}
                  ></input>
                  <label
                    className="pwLabel"
                    htmlFor="confirmPassword"
                    ref={$confirmPasswordLabelRef}
                  >
                    Confirm Password
                  </label>
                </div>
                <div className="btn-area">
                  <button id="btn" type="submit" onClick={submitSignUp}>
                    ????????????
                  </button>
                </div>
              </form>

              <div className="btn-area-b" onClick={togleSignUpMode}>
                ??????????????? ????????????
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="login-form">
              <form>
                <h1>LOGIN</h1>
                <div className="int-area">
                  <input
                    id="id"
                    autoComplete="email"
                    type="text"
                    required
                    onChange={onChangeLoginEmail}
                    ref={loginEmailRef}
                    value={userLoginEmail}
                  ></input>
                  <label className="idLabel" htmlFor="id" ref={$emailLabelRef}>
                    ID
                  </label>
                </div>
                <div className="int-area">
                  <input
                    type="password"
                    name="pw"
                    id="pw"
                    autoComplete="off"
                    required
                    onChange={onChangeLoginPassword}
                    ref={loginPasswordRef}
                    value={userLoginPassword}
                  ></input>
                  <label
                    className="pwLabel"
                    htmlFor="pw"
                    ref={$passwordLabelRef}
                  >
                    PASSWORD
                  </label>
                </div>
                <div className="btn-area">
                  <button id="btn" type="submit" onClick={submitLogin}>
                    LOGIN
                  </button>
                </div>
                <a
                  className="btn-area-a btn-area-kakao"
                  // href="http://localhost:3065/api/user/callback/kakao"
                  href={KAKAO_AUTH_URL}
                >
                  KAKAO LOGIN
                </a>
                <p className="subText">
                  ?????? DARF??? ????????? ????????????????{" "}
                  <span className="btn-area-b" onClick={togleSignUpMode}>
                    ????????????
                  </span>
                </p>
              </form>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
