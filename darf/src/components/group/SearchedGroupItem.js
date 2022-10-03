import { message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { JOIN_GROUP_REQUEST } from "../../modules/reducers/group";
import Modal from "../Modal";
import { timeForToday } from "../../util/function";

const SearchedGroupItem = ({ group, searchGroupPurpose }) => {
  const [groupPasswordCheckModalOpen, setGroupPasswordCheckModalOpen] =
    useState(false);
  const [groupPasswordValue, setGroupPasswordValue] = useState("");

  const dispatch = useDispatch();

  /** 그룹 가입 버튼을 클릭했을때 backend로 "JOIN_GROUP" Dispatch 및 front에서 1차적으로 가입 불가 조건을 수행하는 함수 */
  const onClickJoinGroup = () => {
    // 그룹 정원보다 가입한 유저 수가 많을 경우
    if (group.capacity <= group.Users?.length) {
      message.error("정원을 초과했습니다.");
      return;
    }
    // 그룹 비밀번호가 있는 경우
    if (group.password?.length >= 1) {
      message.info("비공개 그룹은 비밀번호를 입력해야 합니다.");
      setGroupPasswordCheckModalOpen(true);
      return;
    }

    dispatch({
      type: JOIN_GROUP_REQUEST,
      data: { groupId: group.id },
    });
  };

  return (
    <div key={group.id} className="searchedGroupItem">
      <span>{group.name}</span>
      <span>{group?.password.length >= 1 ? "🔒︎" : ""}</span>
      <div className="groupEmojiWrapper">
        <p className="groupEmoji">{group.emoji}</p>
      </div>
      <p>{`${group.Users.length}/${group.capacity}`}</p>
      {group.purpose &&
        JSON.parse(group.purpose).map((purpose, index) => {
          if (purpose === searchGroupPurpose) {
            return (
              <span
                className={`groupPurpose groupPurpose-${index} groupPurpose-active`}
                key={index}
              >
                {purpose}
              </span>
            );
          }

          return (
            <span className={`groupPurpose groupPurpose-${index}`} key={index}>
              {purpose}
            </span>
          );
        })}
      <p>{group.introduce}</p>
      <p>{`${timeForToday(group.createdAt)}`}</p>
      <button
        onClick={() => {
          return onClickJoinGroup();
        }}
      >
        가입하기
      </button>
      {groupPasswordCheckModalOpen && (
        <Modal
          okAction={() => {
            dispatch({
              type: JOIN_GROUP_REQUEST,
              data: { groupId: group.id },
            });
            setGroupPasswordCheckModalOpen(false);
            setGroupPasswordValue("");
          }}
          okMessage={groupPasswordValue === group.password && "가입하기"}
          // 백엔드에서 검증을 안하기 때문에 이후 수정이 필요함
          innerContents={
            <div>
              <p>{`[${group.name}]그룹은 비공개 그룹입니다.`}</p>
              <input
                placeholder="비밀번호를 입력해주세요"
                value={groupPasswordValue}
                onChange={(e) => {
                  setGroupPasswordValue(e.target.value);
                }}
              ></input>
              <div></div>
            </div>
          }
          closeAction={() => {
            setGroupPasswordCheckModalOpen(false);
            setGroupPasswordValue("");
          }}
        ></Modal>
      )}
    </div>
  );
};

export default SearchedGroupItem;
