import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CREATE_COMMENT_REQUEST,
  LIKE_POST_REQUEST,
  REMOVE_GROUP_POST_REQUEST,
} from "../../modules/reducers/group";
import Comment from "./comment";

const PostItem = ({ post }) => {
  const { me } = useSelector((state) => state.user);
  const { selected } = useSelector((state) => state.group.group);
  const [date, setDate] = useState(new Date(post.date));
  const [clapping, setClapping] = useState(false);

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

  const dispatch = useDispatch();

  const $clabCounterLabelRef = useRef();

  const onClickLike = (e) => {
    console.log(e.target);
    console.log(e.target.previousSibling);
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
    console.log("정말 삭제하냐는 모달 호출");

    dispatch({
      type: REMOVE_GROUP_POST_REQUEST,
      data: post.id,
    });
  };

  return (
    <div className="PostItem">
      {post.PostType === "Diet" && (
        <div>
          <span>{`${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}일의 기록`}</span>
          <p>{timeForToday(post.createdAt)}</p>
          <p>
            <span>
              {post.User?.UserProfile ? post.User.UserProfile.emoji : "🌱"}
            </span>
            {post?.UserId === me?.id
              ? `${post.User.nickname}(나)가 작성함`
              : ` ${post.User.nickname}이(가) 작성함`}
          </p>
          <p>{`내가 먹은거: ${post.name}`}</p>
          <div className="postImageBox">
            {JSON.parse(post.image)?.map((e) => {
              return (
                <div className="postImageItem" key={e}>
                  <img src={`http://localhost:3065/images/${e}`} alt={e}></img>
                </div>
              );
            })}
          </div>
          <p>{`"${post.type}" 으로 먹었음`}</p>

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

          {(post.UserId === me.id || me.id === selected.adminId) && (
            <button onClick={onClickRemovePostBtn}>삭제</button>
          )}

          <Comment
            comment={post.PostComments}
            eventHandler={onSubmitComment}
            post={post}
          ></Comment>
        </div>
      )}
      {post.PostType === "Exercise" && (
        <div>
          <span>{`${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()}일의 기록`}</span>
          <p>{timeForToday(post.createdAt)}</p>
          <p>{`내가 누구? ${post.User.nickname}`}</p>
          <p>{`내가 한 운동: ${post.name}`}</p>
          <p>{`${post.minute}분 동안 ${post.intensity}의 강도로 함`}</p>

          <p>{`"${post.type}" 의 부위를 운동`}</p>

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

          {(post.UserId === me.id || me.id === selected.adminId) && (
            <button onClick={onClickRemovePostBtn}>삭제</button>
          )}

          <Comment
            comment={post.PostComments}
            eventHandler={onSubmitComment}
            post={post}
          ></Comment>
        </div>
      )}
      {post.PostType === "content" && <div></div>}
    </div>
  );
};

export default PostItem;
