import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CHANGE_GROUP_ADMIN_REQUEST,
  DROP_USER_REQUEST,
  EDIT_GROUP_REQUEST,
  REMOVE_GROUP_REQUEST,
} from "../../modules/reducers/group";

import SelectBox from "../SelectBox";
import { emoji } from "../../util/publicData";

const EditGroupInfoForm = ({ group }) => {
  const { me } = useSelector((state) => state.user);

  const [GroupEmoji, setGroupEmoji] = useState(group.emoji);
  const [GroupName, setGroupName] = useState(group.name);
  const [GroupCapacity, setGroupCapacity] = useState(group.capacity);
  const [GroupIntroduce, setGroupIntroduce] = useState(group.introduce);
  const [GroupPassword, setGroupPassword] = useState(group.password);

  const onChangeGroupName = (e) => {
    setGroupName(e.target.value);
  };
  const onChangeGroupCapacity = (e) => {
    setGroupCapacity(e.target.value);
  };

  const onChangeGroupIntroduce = (e) => {
    setGroupIntroduce(e.target.value);
  };

  const onChangeGroupPassword = (e) => {
    setGroupPassword(e.target.value);
  };

  const dispatch = useDispatch();

  const onClickEditGroupInfoBtn = () => {
    dispatch({
      type: EDIT_GROUP_REQUEST,
      data: {
        groupId: group.id,
        emoji: GroupEmoji,
        name: GroupName,
        capacity: GroupCapacity,
        introduce: GroupIntroduce,
        password: GroupPassword,
      },
    });
  };

  const onClickDropUserBtn = (userId) => {
    dispatch({
      type: DROP_USER_REQUEST,
      data: { groupId: group.id, userId },
    });
  };

  const onClickRemoveGroupBtn = () => {
    dispatch({
      type: REMOVE_GROUP_REQUEST,
      data: { groupId: group.id },
    });
  };

  return (
    <div className="EditGroupInfoFormComponent">
      <div className="groupInfomationForm">
        <p>그룹 기본정보 변경</p>
        <label htmlFor="groupName">그룹 이름 변경</label>
        <input
          name="groupName"
          value={GroupName}
          onChange={onChangeGroupName}
          placeholder="그룹 이름을 입력해주세요"
        ></input>
        <label htmlFor="groupEmoji">그룹 EMOJI 변경</label>
        <SelectBox
          name="groupEmoji"
          props={emoji}
          eventHandler={setGroupEmoji}
          defaultEmoji={group.emoji}
        ></SelectBox>
        <br></br>

        <label htmlFor="groupCapacity">그룹 정원 변경</label>
        <input
          placeholder="그룹 정원을 입력해주세요"
          name="groupCapacity"
          value={GroupCapacity}
          onChange={onChangeGroupCapacity}
        ></input>
        <label htmlFor="groupIntroduce">그룹 소개 변경</label>
        <textarea
          name="groupIntroduce"
          value={GroupIntroduce}
          onChange={onChangeGroupIntroduce}
          placeholder="그룹 소개를 입력해주세요"
        ></textarea>
        {GroupPassword?.length >= 1 ? (
          <>
            <span>비공개</span>
            <br></br>
            <input
              // name="editGroupPasswordInput"
              onChange={onChangeGroupPassword}
              value={GroupPassword}
              placeholder="비밀번호를 입력해주세요"
            ></input>
          </>
        ) : (
          <>
            <label
            // htmlFor="editGroupPasswordInput"
            >
              공개된 그룹
            </label>
            <br></br>
            <input
              // name="editGroupPasswordInput"
              onChange={onChangeGroupPassword}
              value={GroupPassword}
              placeholder="비밀번호를 입력해주세요"
            ></input>
          </>
        )}
        <button onClick={onClickEditGroupInfoBtn}>변경하기</button>
      </div>
      <p>유저 관리</p>
      {group.Users?.map((user) => {
        return (
          user.id !== me.id && (
            <li key={user.id}>
              {user.nickname}{" "}
              <button
                onClick={() => {
                  onClickDropUserBtn(user.id);
                }}
              >
                유저 내보내기
              </button>
              <button
                onClick={() => {
                  dispatch({
                    type: CHANGE_GROUP_ADMIN_REQUEST,
                    data: { groupId: group.id, userId: user.id },
                  });
                }}
              >
                관리자 양도
              </button>
            </li>
          )
        );
      })}
      <button onClick={onClickRemoveGroupBtn}>그룹 삭제</button>
    </div>
  );
};

export default EditGroupInfoForm;
