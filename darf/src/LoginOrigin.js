import React, { useCallback, useEffect, useRef, useState } from "react";

import { message, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  USER_LOGIN_REQUEST,
  USER_SIGNUP_REQUEST,
} from "./modules/reducers/user";
import { KAKAO_AUTH_URL } from "./util/OAuth";

const LoginOrigin = () => {
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
  const signUpConfirmPasswordRef = useRef();

  // ############ onChange ############
  const onChangeLoginEmail = useCallback((e) => {
    setUserLoginEmail(e.target.value);
  }, []);

  const onChangeLoginPassword = useCallback((e) => {
    setUserLoginPassword(e.target.value);
  }, []);

  const onChangeSignUpEmail = useCallback((e) => {
    setUserSignUpEmail(e.target.value);
  }, []);

  const onChangeSignUpPassword = useCallback((e) => {
    setUserSignUpPassword(e.target.value);
  }, []);

  const onChangeSignUpNickname = useCallback((e) => {
    setUserSignUpNickname(e.target.value);
  }, []);

  const onChangeConfirmSignUpPassword = useCallback((e) => {
    setUserSignUpConfirmPassword(e.target.value);
  }, []);

  const togleSignUpMode = useCallback(() => {
    setUserSignUpEmail(userLoginEmail);
    setUserSignUpPassword(userLoginPassword);
    setSignUpMode((prev) => !prev);
  }, [userLoginEmail, userLoginPassword]);

  const submitLogin = () => {
    console.log(userLoginEmail, userLoginPassword);
    dispatch({
      type: USER_LOGIN_REQUEST,
      data: { email: userLoginEmail, password: userLoginPassword },
    });
    // 백엔드 서버에서 받아온 이메일이 존재하지 않을 때
    // loginEmailRef.current.focus();
    // message.error(error);

    // 백엔드 서버에서 받아온 비밀번호가 틀렸을 때
    // loginPasswordRef.current.focus();
    // message.error(error);
  };

  const submitSignUp = () => {
    console.log(
      userSignUpEmail,
      userSignUpPassword,
      userSingUpNickname,
      userSignUpConfirmPassword
    );

    if (userSignUpPassword !== userSignUpConfirmPassword) {
      message.error("비밀번호를 확인해 주세요.");
      signUpConfirmPasswordRef.current.focus();
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
    // 백엔드 서버에서 받아온 비밀번호가 틀렸을 때
    // loginPasswordRef.current.focus();
    if (logInError) {
      message.warning(logInError);
    }
  }, [logInError]);

  useEffect(() => {
    //백엔드 서버에서 이미 같은 이메일이 존재할 때
    //백엔드 서버 오류 시
    if (signUpError) {
      message.warning(signUpError);
      return;
    }
  }, [signUpError]);

  useEffect(() => {
    if (me?.userEmail) {
      message.success("로그인 되었습니다!");
      navigate("/");
    }
  }, [me, navigate]);

  useEffect(() => {
    if (signUpDone) {
      message.success("가입되었습니다!");
      navigate("/");
    }
  }, [signUpDone, navigate]);

  return (
    <div className="LoginPage">
      <div
        style={{
          maxWidth: "500px",
          padding: "40px",

          margin: "0 auto",
        }}
      >
        {signUpMode ? (
          <>
            <h2>Sign Up</h2>
            <Form
              style={{ width: "100%" }}
              initialValues={{
                remember: true,
              }}
              onFinish={submitSignUp}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "이메일 양식이 맞지 않습니다.",
                  },
                ]}
                onChange={onChangeSignUpEmail}
                ref={signUpEmailRef}
              >
                <Input placeholder="Email" />
              </Form.Item>
              <Form.Item
                name="nickname"
                rules={[
                  {
                    required: true,
                    message: "사용하실 별명을 입력해 주세요.",
                  },
                ]}
                onChange={onChangeSignUpNickname}
              >
                <Input placeholder="Nickname" ref={loginEmailRef} />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "비밀번호를 입력해주세요.",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  type="password"
                  placeholder="Password"
                  onChange={onChangeSignUpPassword}
                />
              </Form.Item>
              <Form.Item
                autoComplete="off"
                name="confirm"
                rules={[
                  {
                    required: true,
                    message: "동일한 비밀번호를 입력해주세요.",
                  },
                ]}
              >
                <Input
                  dependencies={["password"]}
                  placeholder="Confirm Password"
                  type="password"
                  onChange={onChangeConfirmSignUpPassword}
                  ref={signUpConfirmPasswordRef}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  회원가입
                </Button>

                <div
                  onClick={togleSignUpMode}
                  style={{
                    marginTop: "10px",
                    textAlign: "center",
                    cursor: "pointer",
                    color: "lightskyblue",
                  }}
                >
                  로그인으로 돌아가기
                </div>
              </Form.Item>
            </Form>
          </>
        ) : (
          <>
            <h2>Sign in</h2>
            <Form
              style={{ width: "100%" }}
              initialValues={{
                remember: true,
              }}
              onFinish={submitLogin}
            >
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    type: "email",
                    message: "이메일 양식이 맞지 않습니다.",
                  },
                ]}
                onChange={onChangeLoginEmail}
              >
                <Input placeholder="Email" ref={loginEmailRef} />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "비밀번호를 입력해 주세요!!",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  ref={loginPasswordRef}
                  type="password"
                  placeholder="Password"
                  onChange={onChangeLoginPassword}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  style={{ width: "100%" }}
                  type="primary"
                  htmlType="submit"
                  className="login-form-button"
                >
                  로그인
                </Button>
                <a
                  // href="http://localhost:3065/api/user/callback/kakao"
                  href={KAKAO_AUTH_URL}
                  style={{
                    display: "inline-block",
                    textDecoration: "none",
                    marginTop: "5px",
                    padding: "5px",
                    background: "	#FEE500",
                    color: "#000000",
                    width: "100%",
                    textAlign: "center",
                    borderRadius: "3px",
                  }}
                >
                  카카오계정으로 로그인
                </a>
                <p style={{ marginTop: "10px", textAlign: "center" }}>
                  계정이 없으신가요?{" "}
                  <span
                    onClick={togleSignUpMode}
                    style={{ cursor: "pointer", color: "lightskyblue" }}
                  >
                    가입하기
                  </span>
                </p>
              </Form.Item>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};

export default LoginOrigin;
