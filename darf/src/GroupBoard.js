import { message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EditGroupInfoForm from "./components/group/EditGroupInfoForm";
import PostItem from "./components/group/postItem";
import {
  LEAVE_GROUP_REQUEST,
  LOAD_GROUP_POSTS_REQUEST,
  LOAD_GROUP_TYPEPOST_REQUEST,
  LOAD_GROUP_USERPOST_REQUEST,
} from "./modules/reducers/group";

const GroupBoard = () => {
  const { selected } = useSelector((state) => state.group.group);
  const { GroupPosts } = useSelector((state) => state.group.group.selected);
  const {
    loadGroupUserPostError,
    leaveGroupError,
    leaveGroupDone,
    removeGroupDone,
    removeGroupError,
    loadGroupPostsError,
    loadSelectedGroupDone,
    editGroupDone,
  } = useSelector((state) => state.group.state);
  const { me, logOutDone } = useSelector((state) => state.user);
  const [showManagementForm, setShowManagementForm] = useState(false);
  const dispatch = useDispatch();
  const [postsIntersecting, setPostsIntersecting] = useState(false);
  const [postLoadMode, setPostLoadMode] = useState("All");

  const postLoaderRef = useRef();

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPostsIntersecting((prev) => !prev);
    }
  }, []);

  useEffect(() => {
    if (postLoadMode !== "All") return;
    dispatch({
      type: LOAD_GROUP_POSTS_REQUEST,
      data: {
        groupId: selected.id,
        lastId: GroupPosts[GroupPosts.length - 1]?.id,
      },
    });
  }, [postsIntersecting]);

  useEffect(() => {
    if (loadSelectedGroupDone) {
      dispatch({
        type: LOAD_GROUP_POSTS_REQUEST,
        data: {
          groupId: selected.id,
          lastId: GroupPosts[GroupPosts.length - 1]?.id,
        },
      });
    }
  }, [loadSelectedGroupDone]);

  useEffect(() => {
    const option = {
      root: null, // document
      rootMargin: "0px",
      threshold: 1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (postLoaderRef.current) {
      observer.observe(postLoaderRef.current);
    }
  }, []);

  const onClickUserNickname = (userId) => {
    setPostLoadMode("User");
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

  useEffect(() => {
    if (editGroupDone) {
      setShowManagementForm(false);
    }
  }, [editGroupDone]);

  const onClickTypePostLoadBtn = (postType) => {
    dispatch({
      type: LOAD_GROUP_TYPEPOST_REQUEST,
      data: { groupId: selected.id, postType },
    });
  };

  return (
    <div className="GroupBoardPage">
      <div className="groupInfomationSection">
        <div className="groupInfomationItem">
          <h2>{selected.name}</h2>
          {me.id === selected.adminId && (
            <>
              <button
                onClick={() => {
                  setShowManagementForm((prev) => !prev);
                }}
              >
                그룹 관리
              </button>

              {showManagementForm && (
                <>
                  <EditGroupInfoForm group={selected}></EditGroupInfoForm>
                </>
              )}
            </>
          )}
          <div className="groupEmojiWrapper">
            <div className="groupEmoji">{selected.emoji}</div>
          </div>
          <div className="groupPurposeList">
            {selected?.purpose &&
              JSON.parse(selected.purpose)?.map((purpose, index) => {
                return (
                  <>
                    <span
                      // className={`groupPurpose groupPurpose-${index}`}
                      key={purpose}
                    >
                      #{purpose}
                    </span>
                    <span> </span>
                  </>
                );
              })}
          </div>
          <div>
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
      </div>
      <div className="groupBoardItemSection">
        <div className="groupBoardSortBtnWrapper">
          <button
            onClick={() => {
              setPostLoadMode("Diet");
              onClickTypePostLoadBtn("Diet");
            }}
          >
            <div className="imageWrapper-center">
              <div className="foodRecodeIcon"></div>
            </div>
            식단 기록만
          </button>{" "}
          <div className="line-y"></div>
          <button
            onClick={() => {
              setPostLoadMode("Exercise");
              onClickTypePostLoadBtn("Exercise");
            }}
          >
            <div className="imageWrapper-center">
              <div className="exerciseRecodeIcon"></div>
            </div>
            운동 기록만
          </button>
          <div className="line-y"> </div>
          <button
            onClick={() => {
              setPostLoadMode("All");
              onClickTypePostLoadBtn("All");
            }}
          >
            전체 기록
          </button>
        </div>
        <div className="groupPostList">
          {selected.GroupPosts?.map((post) => {
            return <PostItem key={post.id} post={post}></PostItem>;
          })}
          {loadGroupPostsError && (
            <div className="groupPostsError">{loadGroupPostsError}</div>
          )}
        </div>

        <div ref={postLoaderRef}></div>
      </div>
    </div>
  );
};

export default GroupBoard;
