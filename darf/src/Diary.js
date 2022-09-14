import { message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Rate } from "antd";
import { FrownOutlined, MehOutlined, SmileOutlined } from "@ant-design/icons";
import {
  DIARY_CREATE_REQUEST,
  LOAD_DIARY_REQUEST,
} from "./modules/reducers/diary";
import DiaryItem from "./components/DiaryItem";

const customIcons = {
  1: <FrownOutlined />,
  2: <FrownOutlined />,
  3: <MehOutlined />,
  4: <SmileOutlined />,
  5: <SmileOutlined />,
};

const Diary = () => {
  const { me, logOutDone } = useSelector((state) => state.user);
  const { state, diary, loadDiaryDone, loadDiaryError } = useSelector(
    (state) => state.diary
  );
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [emotion, setEmotion] = useState(3.0);

  const titleRef = useRef();
  const contentRef = useRef();

  const onChangeTitle = (e) => {
    setTitle(e.target.value);
  };
  const onChangeContent = (e) => {
    setContent(e.target.value);
  };
  const onChangeEmotion = (e) => {
    setEmotion(e);
  };
  const dispatch = useDispatch();

  const onSubmit = useCallback(() => {
    if (title.length <= 0) {
      message.warning("제목을 입력해주세요!");
      titleRef.current.focus();
      return;
    }

    if (content.length <= 0) {
      message.warning("내용을 채워주세요!");
      contentRef.current.focus();
      return;
    }

    dispatch({
      type: DIARY_CREATE_REQUEST,
      data: { title, content, emotion },
    });
  }, [title, content, emotion, dispatch]);

  const navigate = useNavigate();
  useEffect(() => {
    if (loadDiaryError) {
      message.warning(loadDiaryError);
      navigate("/");
      return;
    }

    if (logOutDone) {
      navigate("/");
      return;
    }

    if (!me?.userEmail) {
      message.warning("로그인이 필요합니다");
      navigate("/");
      return;
    }
  }, [me, navigate, loadDiaryDone, loadDiaryError, logOutDone]);

  useEffect(() => {
    if (state.diaryCreateDone) {
      setTitle("");
      setContent("");
      setEmotion(3);
    }
  }, [state]);

  useEffect(() => {
    dispatch({
      type: LOAD_DIARY_REQUEST,
    });
  }, [dispatch]);

  return (
    <div className="DiaryPage">
      <h2>Diary without CSS</h2>
      <header>헤더부분</header>
      <div className="DiaryForm">
        <input
          placeholder="제목?"
          value={title}
          onChange={onChangeTitle}
          ref={titleRef}
        ></input>
        <textarea
          placeholder="내용을 말해주세요"
          value={content}
          onChange={onChangeContent}
          ref={contentRef}
        ></textarea>
        <Rate
          className="rate"
          allowHalf
          value={emotion}
          onChange={onChangeEmotion}
          character={({ index }) => customIcons[index + 1]}
        />
        <button onClick={onSubmit}>쓰기!</button>
      </div>
      <div className="DiaryList">
        {diary.map((e) => {
          return <DiaryItem key={e.id} diary={e} />;
        })}
      </div>
      <button onClick={() => navigate(-1)}>돌아가기</button>
    </div>
  );
};

export default Diary;
