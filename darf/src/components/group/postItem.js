import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_COMMENT_REQUEST,
  LIKE_POST_REQUEST,
  REMOVE_GROUP_POST_REQUEST,
} from "../../modules/reducers/group";
import Comment from "./comment";
import Modal from "../Modal";
import { timeForToday } from "../../util/function";

const PostItem = ({ post }) => {
  const { me } = useSelector((state) => state.user);
  const { selected } = useSelector((state) => state.group.group);
  const [date, setDate] = useState(new Date(post.date));
  const [clapping, setClapping] = useState(false);
  const [groupPostRemoveModalOpen, setGroupPostRemoveModalOpen] =
    useState(false);

  const [isOpendOptions, setIsOpendOptions] = useState(false);
  const dispatch = useDispatch();

  const $clabCounterLabelRef = useRef();

  const onClickLike = (e) => {
    e.preventDefault();
    e.target.previousSibling.classList.add("first");
    e.target.classList.add("active");
    setClapping(true);
    dispatch({
      type: LIKE_POST_REQUEST,
      data: { postId: post.id, like: post.like },
    });
    if (!clapping) {
      setTimeout(() => {
        e.target.previousSibling.classList.remove("first");
        e.target.classList.remove("active");
        setClapping(false);
      }, 1000);
    }
  };

  /** comment와 post정보를 dispatch 하는 함수
   */
  const onSubmitComment = (comment, isSecret) => {
    dispatch({
      type: CREATE_COMMENT_REQUEST,
      data: { postId: post.id, comment, isSecret },
    });
  };

  /** 게시글 삭제버튼을 누를때 호출하는 deletePost dispatch를 수행하는 함수 */
  const onClickRemovePostBtn = () => {
    dispatch({
      type: REMOVE_GROUP_POST_REQUEST,
      data: post.id,
    });
  };

  return (
    <>
      <div className={`PostItem ${post?.UserId === me?.id ? "mine" : ""}`}>
        <div className="postHeader">
          {post?.UserId === me?.id ? (
            <>
              <div className="clapWrapper">
                <label
                  className="clapCounter"
                  ref={$clabCounterLabelRef}
                  id={`clapLabel${post.id}`}
                >
                  {`+${post.like}`}
                </label>

                <button
                  id="clapBtn"
                  className="clapBtn"
                  onClick={(e) => onClickLike(e)}
                >
                  👏
                </button>
              </div>
              <span className="postDate">{`${date.getFullYear()}-${
                date.getMonth() + 1
              }-${
                date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
              }`}</span>
            </>
          ) : (
            <>
              <span className="postDate">{`${date.getFullYear()}-${
                date.getMonth() + 1
              }-${
                date.getDate() < 10 ? 10 + date.getDate() : date.getDate()
              }`}</span>
              <div className="clapWrapper">
                <label
                  className="clapCounter"
                  ref={$clabCounterLabelRef}
                  id={`clapLabel${post.id}`}
                >
                  {`+${post.like}`}
                </label>

                <button
                  id="clapBtn"
                  className="clapBtn"
                  onClick={(e) => onClickLike(e)}
                >
                  👏
                </button>
              </div>
            </>
          )}
        </div>
        <p className="postUserNickname">
          {post?.UserId === me?.id ? null : (
            <>
              <span>
                {post.User?.UserProfile ? post.User.UserProfile.emoji : "🌱"}
              </span>
              <span>{`${post.User.nickname}`}</span>
            </>
          )}
        </p>
        {post.PostType === "Diet" && (
          <div
            className="postBody"
            onClick={() => {
              setIsOpendOptions((prev) => !prev);
            }}
          >
            <p>{timeForToday(post.createdAt)}</p>

            <p>{`${post.name} / ${post.type} / ${post.kcal}kcal`}</p>
            <div className="postImageBox">
              {JSON.parse(post.image)?.map((e) => {
                return (
                  <div className="postImageItem" key={e}>
                    <img
                      src={`http://localhost:3065/images/${e}`}
                      alt={e}
                    ></img>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {post.PostType === "Exercise" && (
          <div
            className="postBody"
            onClick={() => {
              setIsOpendOptions((prev) => !prev);
            }}
          >
            <p>{timeForToday(post.createdAt)}</p>
            <p>{`${post.name} / ${post.minute}분 / ${Array.from(
              JSON.parse(post.intensity)
            )} / ${
              post.bodyPart?.length >= 0
                ? Array.from(JSON.parse(post.bodyPart)) + "/"
                : ""
            } ${Array.from(JSON.parse(post.type))}`}</p>
          </div>
        )}

        {isOpendOptions && (
          <Comment
            comment={post.PostComments}
            onCreateHandler={onSubmitComment}
            post={post}
          ></Comment>
        )}
        {isOpendOptions &&
          (post.UserId === me.id || me.id === selected.adminId) && (
            <button
              onClick={() => {
                setGroupPostRemoveModalOpen(true);
              }}
            >
              삭제
            </button>
          )}

        {post.PostType === "content" && <div></div>}
      </div>
      {groupPostRemoveModalOpen && (
        <Modal
          innerContents={
            <div>
              <h3>게시글 삭제</h3>
              <span className="timeStamp">{timeForToday(post.createdAt)}</span>
              <span>{` 작성된 이 게시물을 삭제할까요...? 😢`}</span>
            </div>
          }
          okMessage="삭제합니다."
          closeMessage="조금 더 고민해볼게요"
          okAction={onClickRemovePostBtn}
          closeAction={() => {
            setGroupPostRemoveModalOpen(false);
          }}
        ></Modal>
      )}
    </>
  );
};

export default PostItem;
