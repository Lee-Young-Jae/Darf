import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SelectBox from "../SelectBox";
import { GROUP_CREATE_REQUEST } from "../../modules/reducers/group";
import { emoji } from "../../util/publicData";

const GroupCreate = ({ purpose }) => {
  const { state } = useSelector((state) => state.group);

  const [GroupEmoji, setGroupEmoji] = useState("💪");
  const [GroupName, setGroupName] = useState("");
  const [GroupCapacity, setGroupCapacity] = useState(10);
  // const [checkedItem, setCheckedItem] = useState(new Set());
  const [GroupIntroduce, setGroupIntroduce] = useState("");
  const [GroupPublic, setGroupPublic] = useState(true);
  const [GroupPassword, setGroupPassword] = useState("");
  const [GroupPurpose, setGroupPurpose] = useState([]);
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

  /** 그룹 생성이 완료되면 state 초기화 그룹 생성 Error시 Error 메세지 출력*/
  useEffect(() => {
    if (state.createGroupError) {
      message.error(state.createGroupError);
    }
    if (state.createGroupDone) {
      setGroupEmoji("💪");
      setGroupName("");
      setGroupCapacity(10);
      // setCheckedItem(new Set());
      setGroupIntroduce("");
      setGroupPublic(true);
      setGroupPassword("");
    }
  }, [state.createGroupError, state.createGroupDone]);

  const onChangeGroupPurpose = (e) => {
    const purpose = e.target.value;
    let isExistPurpose = GroupPurpose.find((item) => item === purpose);
    if (isExistPurpose) {
      // 이미 값이 배열안에 있다면
      setGroupPurpose(GroupPurpose.filter((item) => item !== purpose));
      return;
    }
    setGroupPurpose([purpose, ...GroupPurpose]);
  };

  // const onChangeCheckHandler = (e) => {
  //   checkedItemHandler(e.target.parentNode, e.target.value, e.target.checked);
  // };
  // const checkedItemHandler = (box, id, isChecked) => {
  //   if (isChecked) {
  //     checkedItem.add(id);
  //     setCheckedItem(checkedItem);
  //     box.style.backgroundColor = "#F6CB44";
  //   } else if (!isChecked && checkedItem.has(id)) {
  //     checkedItem.delete(id);
  //     setCheckedItem(checkedItem);
  //     box.style.backgroundColor = "#FFF";
  //   }
  //   return checkedItem;
  // };

  const dispatch = useDispatch();
  const onSubmitCreateGroup = (e) => {
    e.preventDefault();
    if (GroupName.length <= 0) {
      message.info("사용할수 없는 그룹 이름입니다.");
      return;
    }

    if (GroupPurpose.length <= 0) {
      message.info("그룹 목표를 한개 이상 설정해주세요!");
      return;
    }

    dispatch({
      type: GROUP_CREATE_REQUEST,
      data: {
        name: GroupName,
        capacity: GroupCapacity,
        purpose: JSON.stringify(GroupPurpose),
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
    <div className="GroupCreateComponent">
      <section className="groupInfomationInputSection">
        <form onSubmit={onSubmitCreateGroup}>
          <div className="formTextbox">
            <input
              id="groupNameInput"
              className="formTextboxInput"
              onChange={onChangeGroupName}
              value={GroupName}
              autoComplete="off"
              required
              type={"text"}
            ></input>
            <label htmlFor="groupNameInput" className="formTextboxLabel">
              그룹 이름
            </label>
          </div>

          <div className="formTextbox">
            <input
              id="groupNameInput"
              className="formTextboxInput"
              onChange={onChangeGroupCapacity}
              value={GroupCapacity}
              autoComplete="off"
              required
              type="number"
              step="1"
              min="2"
              max="20"
            ></input>
            <label htmlFor="groupNameInput" className="formTextboxLabel">
              최대 정원
            </label>
          </div>
          <div>
            <span>내 그룹을 소개합니다: </span>
            <textarea
              max="50"
              onChange={onChangeGroupIntroduce}
              value={GroupIntroduce}
            ></textarea>
          </div>
          <div>
            <label>
              <SelectBox props={emoji} eventHandler={setGroupEmoji}></SelectBox>
            </label>
            <br></br>
            <span>그룹 목표: </span>
            {purpose.map((e) => {
              return (
                <label key={e.id} className="TypeBox">
                  <input
                    type="checkbox"
                    value={e.purpose}
                    // onChange={onChangeCheckHandler}
                    onChange={onChangeGroupPurpose}
                  ></input>
                  <span>{e.purpose}</span>
                </label>
              );
            })}
          </div>
          <div>
            <div>
              <label htmlFor="groupPublic">그룹 공개: </label>
              <input
                name="groupPublic"
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
      </section>
      <section
        className={`${"groupInformationPreviewForm"} ${
          GroupName.length >= 1 ||
          GroupPurpose.length >= 1 ||
          GroupIntroduce.length >= 1
            ? "active"
            : null
        }`}
      >
        <div className="searchedGroupItem">
          <button>가입하기</button>
          <div className="groupName">{`${GroupName}${
            GroupPublic ? "" : "🔒︎"
          }`}</div>
          <div className="groupEmojiWrapper">
            <div className="groupEmoji">{GroupEmoji}</div>
          </div>
          <div className="groupCapacity">1/{GroupCapacity}</div>
          {GroupPurpose.map((purpose) => {
            console.log(purpose);
            return <span className="groupPurpose ">#{purpose}</span>;
          })}
          <div className="groupIntroduce">{GroupIntroduce}</div>
        </div>
      </section>
    </div>
  );
};

export default GroupCreate;
