import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditGroupInfoForm from "./components/group/EditGroupInfoForm";
import PostItem from "./components/group/postItem";
import {
  LEAVE_GROUP_REQUEST,
  LOAD_GROUP_USERPOST_REQUEST,
} from "./modules/reducers/group";

const GroupBoard = () => {
  const { selected } = useSelector((state) => state.group.group);
  const {
    loadGroupUserPostError,
    leaveGroupError,
    leaveGroupDone,
    removeGroupDone,
    removeGroupError,
  } = useSelector((state) => state.group.state);
  const { me, logOutDone } = useSelector((state) => state.user);
  const [showManagementForm, setShowManagementForm] = useState(false);

  const dispatch = useDispatch();

  const onClickUserNickname = (userId) => {
    dispatch({
      type: LOAD_GROUP_USERPOST_REQUEST,
      data: { userId, groupId: selected.id },
    });
  };

  useEffect(() => {
    if (loadGroupUserPostError) message.info(loadGroupUserPostError);
  }, [loadGroupUserPostError]);

  // 로그인 여부 확인
  const navigate = useNavigate();
  useEffect(() => {
    if (logOutDone) {
      navigate("/");
      return;
    }

    if (!me?.userEmail) {
      message.warning("로그인이 필요합니다");
      navigate("/login");
      return;
    }
  }, [me, navigate, logOutDone]);

  const onClickLeaveGroupBtn = () => {
    dispatch({ type: LEAVE_GROUP_REQUEST, data: { groupId: selected.id } });
  };

  useEffect(() => {
    if (leaveGroupError) {
      message.info(leaveGroupError);
    }

    if (leaveGroupDone) {
      message.success("성공적으로 그룹에서 떠났습니다.");
      navigate("/group");
    }
  }, [leaveGroupError, leaveGroupDone, navigate]);

  useEffect(() => {
    if (removeGroupError) {
      message.info(removeGroupError);
    }

    if (removeGroupDone) {
      navigate("/group");
    }
  }, [removeGroupDone, removeGroupError, navigate]);

  return (
    <div className="GroupBoardPage">
      <p>여기는 그룹 보드 페이지입니다.</p>

      <div>
        <span>대충 현재 그룹 정보</span>
        <h2>{selected.name}</h2>
        {me.id === selected.adminId && (
          <>
            <button
              onClick={() => {
                setShowManagementForm((prev) => !prev);
              }}
            >
              관리자만 보이는 그룹 관리 버튼
            </button>

            {showManagementForm && (
              <>
                <EditGroupInfoForm group={selected}></EditGroupInfoForm>
              </>
            )}
          </>
        )}
        <div>{selected.emoji}</div>
        <div>
          {selected?.purpose &&
            JSON.parse(selected.purpose)?.map((purpose, index) => {
              return (
                <span
                  className={`groupPurpose groupPurpose-${index}`}
                  key={purpose}
                >
                  {purpose}
                </span>
              );
            })}
        </div>
        <div>
          <span>대충 유저 정보</span>
          <span>가입한 유저 List</span>
          <ul>
            {selected.Users?.map((user) => {
              return user.id === selected.adminId ? (
                <li
                  className="userListName"
                  key={user.id}
                  onClick={() => onClickUserNickname(user.id)}
                >
                  <span>{user.UserProfile?.emoji}</span>
                  {user.nickname} <span>(👑)</span>
                </li>
              ) : (
                <li
                  key={user.id}
                  id={user.id}
                  className="userListName"
                  onClick={() => onClickUserNickname(user.id)}
                >
                  <span>
                    {user.UserProfile?.emoji ? user.UserProfile.emoji : "🌱"}
                  </span>
                  {user.nickname}
                </li>
              );
            })}
          </ul>
        </div>
        <button onClick={onClickLeaveGroupBtn}>그룹 탈퇴</button>
      </div>
      <div>
        <span>대충 게시글 목록</span>
        {selected.GroupPosts?.map((post) => {
          return <PostItem key={post.id} post={post}></PostItem>;
        })}
      </div>
    </div>
  );
};

export default GroupBoard;
