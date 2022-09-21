import React, { useCallback, useState } from "react";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { REMOVE_COMMENT_REQUEST } from "../../modules/reducers/group";
import Modal from "../Modal";

const Comment = ({
  comment = [{ id: 1, nickname: "", comment: "입력된 댓글이 없습니다." }],
  onCreateHandler,
  post,
}) => {
  const [postComment, setPostComment] = useState("");
  const [isCommentSecret, setIsCommentSecret] = useState(false);
  const [commentRemoveModalOpen, setCommentRemoveModalOpen] = useState(false);
  const [commentRemoveTargetId, setCommentRemoveTargetId] = useState();
  const { me } = useSelector((state) => state.user);
  const { adminId } = useSelector((state) => state.group.group.selected);

  const dispatch = useDispatch();

  const onClickRemoveCommentBtn = useCallback(
    (commentId) => {
      dispatch({
        type: REMOVE_COMMENT_REQUEST,
        data: { commentId, postId: post.id },
      });
      setCommentRemoveModalOpen(false);
    },
    [dispatch, post.id]
  );

  const onClickCommentSubmitBtn = () => {
    if (postComment?.length < 5) {
      message.info("댓글은 5자 이상 입력해 주세요.");
      return;
    }
    onCreateHandler(postComment, isCommentSecret);
    setPostComment("");
    setIsCommentSecret(false);
  };

  const timeForToday = (value) => {
    const today = new Date();
    const timeValue = new Date(value);

    const betweenTime = Math.floor(
      (today.getTime() - timeValue.getTime()) / 1000 / 60
    );
    if (betweenTime < 1) return "방금전";
    if (betweenTime < 60) {
      return `${betweenTime}분전`;
    }

    const betweenTimeHour = Math.floor(betweenTime / 60);
    if (betweenTimeHour < 24) {
      return `${betweenTimeHour}시간전`;
    }

    const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
    if (betweenTimeDay < 365) {
      return `${betweenTimeDay}일전`;
    }

    return `${Math.floor(betweenTimeDay / 365)}년전`;
  };

  return (
    <div className="CommentComponent">
      응애 나 코멘트 Component
      <div>
        {comment?.map((comment) => {
          return (
            <div
              key={comment.id}
              id={`comment-${comment.id}`}
              className="commentItem"
            >
              <div>
                {comment.isSecret ? (
                  <>
                    <span className="nicknameIcon">{"😎"}</span>
                    <span className="commentNickname">{"익명"}</span>
                  </>
                ) : (
                  <>
                    <span className="nicknameIcon">
                      {comment.User?.UserProfile?.emoji
                        ? comment.User.UserProfile.emoji
                        : "🌱"}
                    </span>
                    <span className="commentNickname">
                      {comment.User.nickname}
                    </span>
                  </>
                )}
                <span>{timeForToday(comment.createdAt)}</span>
              </div>
              <div>{comment.content}</div>
              {comment.User.id === me.id || me.id === adminId ? (
                <button
                  id={`comment-${comment.id}`}
                  onClick={(event) => {
                    setCommentRemoveTargetId(
                      parseInt(event.target.id.substr(8))
                    );
                    setCommentRemoveModalOpen(true);
                  }}
                >
                  삭제
                  {commentRemoveModalOpen &&
                    commentRemoveTargetId === comment.id && (
                      <Modal
                        innerContents={
                          <div>
                            <h2>게시글 삭제</h2>
                            <span className="timeStamp">
                              {timeForToday(comment.createdAt)}
                            </span>
                            <span>{` 작성된 이 댓글을 삭제할까요...? 😢`}</span>
                          </div>
                        }
                        okMessage="삭제합니다."
                        closeMessage="조금 더 고민해볼게요"
                        okAction={(event) => {
                          onClickRemoveCommentBtn(comment.id);
                        }}
                        closeAction={() => {
                          setCommentRemoveModalOpen(false);
                        }}
                      ></Modal>
                    )}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
      <div className="commentInputBox">
        <p>✔댓글쓰기</p>
        <div className="commentInputBoxFlex">
          <textarea
            value={postComment}
            onChange={(e) => {
              setPostComment(e.target.value);
            }}
          ></textarea>
          <div>
            <label>
              익명
              <input
                type="checkbox"
                checked={isCommentSecret}
                onChange={() => {
                  setIsCommentSecret((prev) => !prev);
                }}
              ></input>
            </label>
            <button onClick={onClickCommentSubmitBtn}>게시</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
