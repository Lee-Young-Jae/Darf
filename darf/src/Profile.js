import { message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Modal from "./components/Modal";
import MyChart from "./components/MyChart";
import {
  CHANGE_NICKNAME_REQUEST,
  CHANGE_PROFILE_EMOJI_REQUEST,
  LOAD_CHALLENGE_REQUEST,
} from "./modules/reducers/user";

const Profile = () => {
  const { me } = useSelector((state) => state.user);
  const { logOutDone, changeNicknameError } = useSelector(
    (state) => state.user.state
  );
  const [isDetailChallenge, setIsDetailChallenge] = useState(false);
  const [isChangeNicknameMode, setIsChangeNicknameMode] = useState(false);
  const [nickname, setNickname] = useState(me?.nickname);

  const dispatch = useDispatch();

  const onClickChangeNicknameBtn = () => {
    if (isChangeNicknameMode) {
      dispatch({
        type: CHANGE_NICKNAME_REQUEST,
        data: { newNickname: nickname },
      });
    }
    setIsChangeNicknameMode((prev) => !prev);
  };

  /** DidMount시 로그인 확인 */
  useEffect(() => {
    if (!me?.userEmail) {
      message.warning("로그인이 필요합니다");
      navigate("/login");
      return;
    }
    if (logOutDone) {
      navigate("/");
      return;
    }
  }, [logOutDone]);

  /** DidMount시에 도전과제 불러오기 */
  useEffect(() => {
    dispatch({
      type: LOAD_CHALLENGE_REQUEST,
      data: 1,
    });
  }, [dispatch]);

  /** 닉네임 변경 오류시 메세지 출력 */
  useEffect(() => {
    if (changeNicknameError) {
      message.error(changeNicknameError);
    }
  }, [changeNicknameError]);

  // 로그인 여부 확인
  const navigate = useNavigate();
  useEffect(() => {
    if (!me?.userEmail) {
      message.warning("로그인이 필요합니다");
      navigate("/");
      return;
    }
  }, [me, navigate, logOutDone]);

  const onClickChallengeItem = (emoji) => {
    if (emoji === "❔") {
      return;
    }
    dispatch({
      type: CHANGE_PROFILE_EMOJI_REQUEST,
      data: { emoji },
    });
  };

  return (
    <div className="ProfilePage">
      <section className="profileHeader">
        <div className={`userProfileEmoji ${isDetailChallenge && "active"}`}>
          {me?.UserProfile?.emoji ? me.UserProfile.emoji : "🌱"}
        </div>
        <div className="challengeBoxWrapper">
          <div>
            {isDetailChallenge ? (
              <div
                className="challengeBox"
                onClick={() => {
                  setIsDetailChallenge((prev) => !prev);
                }}
              >
                {me?.challenge?.map((challenge) => {
                  return (
                    <div
                      className="challengeItem"
                      key={challenge.id}
                      onClick={() => {
                        onClickChallengeItem(challenge.icon);
                      }}
                    >
                      <p className="challengeTitle">{challenge.title}</p>
                      <p className="challengeIcon">{challenge.icon}</p>
                      <p className="challengeContent">{challenge.content}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div
                className="challengeBox-folded"
                onClick={() => {
                  setIsDetailChallenge((prev) => !prev);
                }}
              >
                {me?.challenge?.map((challenge) => {
                  return (
                    <div key={challenge.id}>
                      <p className="challengeIcon">{challenge.icon}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      <section className="profileBody">
        {isChangeNicknameMode ? (
          <input
            className="changeNicknameInput"
            value={nickname}
            onChange={(e) => {
              setNickname(e.target.value);
            }}
          ></input>
        ) : (
          <>
            <h2 className="nickname">{me?.nickname}</h2>
          </>
        )}
        <div>
          <button onClick={onClickChangeNicknameBtn}>Edit</button>
        </div>

        {me && <MyChart></MyChart>}
      </section>
      {/* <div>Three.js로 3D 모델링 폼</div>
      <div>기록 모아보기 Form</div> */}
    </div>
  );
};

export default Profile;
