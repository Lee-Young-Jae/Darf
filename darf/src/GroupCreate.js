import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectBox from "./components/SelectBox";
import { GROUP_CREATE_REQUEST } from "./modules/reducers/group";

const GroupCreate = ({ purpose }) => {
  const { state } = useSelector((state) => state.group);

  const [GroupEmoji, setGroupEmoji] = useState("💪");
  const [GroupName, setGroupName] = useState("");
  const [GroupCapacity, setGroupCapacity] = useState(10);
  const [checkedItem, setCheckedItem] = useState(new Set());
  const [GroupIntroduce, setGroupIntroduce] = useState("");
  const [GroupPublic, setGroupPublic] = useState(true);
  const [GroupPassword, setGroupPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const onChangeGroupName = (e) => {
    setGroupName(e.target.value);
  };
  const onChangeGroupCapacity = (e) => {
    setGroupCapacity(e.target.value);
  };
  const onChangeGroupIntroduce = (e) => {
    setGroupIntroduce(e.target.value);
  };

  const emoji = {
    options: [
      { value: "💪" },
      { value: "🚴‍♀️" },
      { value: "🔥" },
      { value: "💦" },
      { value: "🥑" },
      { value: "🥗" },
      { value: "🥩" },
      { value: "👙" },
      { value: "👟" },
      { value: "⚽" },
      { value: "🏓" },
      { value: "🏸" },
      { value: "🍛" },
      { value: "🍮" },
    ],
  };

  /** 그룹 생성이 완료되면 state 초기화 그룹 생성 Error시 Error 메세지 출력*/
  useEffect(() => {
    if (state.createGroupError) {
      message.error(state.createGroupError);
    }
    if (state.createGroupDone) {
      setGroupEmoji("💪");
      setGroupName("");
      setGroupCapacity(10);
      setCheckedItem(new Set());
      setGroupIntroduce("");
      setGroupPublic(true);
      setGroupPassword("");
    }
  }, [state.createGroupError, state.createGroupDone]);
  const onChangeCheckHandler = (e) => {
    checkedItemHandler(e.target.parentNode, e.target.value, e.target.checked);
  };
  const checkedItemHandler = (box, id, isChecked) => {
    if (isChecked) {
      checkedItem.add(id);
      setCheckedItem(checkedItem);
      box.style.backgroundColor = "#F6CB44";
    } else if (!isChecked && checkedItem.has(id)) {
      checkedItem.delete(id);
      setCheckedItem(checkedItem);
      box.style.backgroundColor = "#FFF";
    }
    return checkedItem;
  };

  const dispatch = useDispatch();
  const onSubmitCreateGroup = (e) => {
    e.preventDefault();
    dispatch({
      type: GROUP_CREATE_REQUEST,
      data: {
        name: GroupName,
        capacity: GroupCapacity,
        purpose: JSON.stringify(Array.from(checkedItem)),
        emoji: GroupEmoji,
        introduce: GroupIntroduce,
        password: GroupPassword,
      },
    });
  };

  /**
   *  그룹을 공개 상태로 바꾸면 입력했던 비밀번호 값을 "" 로 초기화
   */
  useEffect(() => {
    setGroupPassword("");
  }, [GroupPublic]);

  return (
    <div className="GroupCreatePage">
      <form onSubmit={onSubmitCreateGroup}>
        <label>
          그룹 이름:
          <input value={GroupName} onChange={onChangeGroupName}></input>
        </label>
        <label>
          그룹 Emoji:
          <SelectBox props={emoji} eventHandler={setGroupEmoji}></SelectBox>
        </label>
        <label>
          그룹 정원
          <input
            value={GroupCapacity}
            type="number"
            step="1"
            max="20"
            onChange={onChangeGroupCapacity}
          ></input>
        </label>
        <div>
          <span>그룹소개:</span>
          <textarea
            onChange={onChangeGroupIntroduce}
            value={GroupIntroduce}
          ></textarea>
        </div>
        <div>
          <span>그룹 목표: </span>
          {purpose.map((e) => {
            return (
              <label key={e.id} className="TypeBox">
                <input
                  type="checkbox"
                  value={e.purpose}
                  onChange={onChangeCheckHandler}
                ></input>
                <span>{e.purpose}</span>
              </label>
            );
          })}
        </div>
        <div>
          <span>그룹 공개: </span>
          <div>
            <input
              type="checkbox"
              checked={GroupPublic}
              onChange={(e) => {
                setGroupPublic((prev) => !prev);
              }}
            ></input>
          </div>
          {GroupPublic || (
            <>
              <label>
                비밀번호
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    setGroupPassword(e.target.value);
                  }}
                  value={GroupPassword}
                ></input>
              </label>
              <label>
                비밀번호 보기
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setShowPassword((prev) => !prev);
                  }}
                  checked={showPassword}
                ></input>
              </label>
            </>
          )}
        </div>
        <button>그룹 생성</button>
      </form>
    </div>
  );
};

export default GroupCreate;
