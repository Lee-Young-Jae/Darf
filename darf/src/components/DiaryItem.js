import React, { useCallback, useEffect, useState } from "react";
import { Popconfirm } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  DIARY_REMOVE_REQUEST,
  DIARY_UPDATE_REQUEST,
  LOAD_DIARY_REQUEST,
} from "../modules/reducers/diary";
import MyButton from "./MyButton";

const DiaryItem = (diary) => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(diary.diary.title);
  const [content, setContent] = useState(diary.diary.content);
  const [emotion, setEmotion] = useState(diary.diary.emotion);
  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const { diaryUpdateDone } = useSelector((state) => state.diary.state);

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const onChangeContent = (e) => {
    setContent(e.target.value);
  };

  const onChangeEmotion = (e) => {
    setEmotion(e.target.value);
  };

  const onRemove = () => {
    dispatch({
      type: DIARY_REMOVE_REQUEST,
      data: diary.diary.id,
    });
  };

  const onChangeModify = useCallback(() => {
    setIsUpdateMode((prev) => !prev);
  }, []);

  const onSubmitModify = () => {
    dispatch({
      type: DIARY_UPDATE_REQUEST,
      data: {
        diaryId: diary.diary.id,
        content: content,
        title: title,
        emotion: emotion,
      },
    });
  };

  useEffect(() => {
    if (diaryUpdateDone) {
      setIsUpdateMode(false);
      dispatch({
        type: LOAD_DIARY_REQUEST,
      });
    }
  }, [diaryUpdateDone, dispatch]);

  return (
    <div className="DiaryItem">
      {isUpdateMode ? (
        <>
          <label htmlFor="title">제목</label>
          <input id="title" value={title} onChange={onChangeTitle}></input>
          <label htmlFor="content">content</label>
          <textarea
            id="content"
            value={content}
            onChange={onChangeContent}
          ></textarea>
          <label htmlFor="emotion">감정점수</label>
          <input
            id="emotion"
            value={emotion}
            onChange={onChangeEmotion}
          ></input>
          <MyButton onClick={onChangeModify} text="취소"></MyButton>
          <MyButton
            onClick={onSubmitModify}
            text="수정"
            btnType={"negative"}
          ></MyButton>
        </>
      ) : (
        <>
          <div className="DiaryHead">
            <div className="title">{diary.diary.title}</div>

            <div>
              <Popconfirm
                title="진짜 삭제해..?"
                okText="Yes"
                cancelText="NO!"
                onConfirm={onRemove}
              >
                <button>x</button>
              </Popconfirm>
            </div>
          </div>
          <div className="content">{diary.diary.content}</div>
          <div className="emotion">{`감정 점수: ${diary.diary.emotion}`}</div>
          <MyButton
            onClick={onChangeModify}
            text="수정"
            btnType={"positive"}
          ></MyButton>
        </>
      )}
    </div>
  );
};

export default DiaryItem;
