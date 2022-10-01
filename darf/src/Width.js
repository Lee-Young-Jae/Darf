import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserWidthItem from "./components/UserWidthItem";
import WeekCalendar from "./components/WeekCalendar";
import { CHANGE_SELECT_DATE_REQUEST } from "./modules/reducers/calendar";
import {
  LOAD_WIDTH_REQUEST,
  WIDTH_WRITE_REQUEST,
} from "./modules/reducers/user";

const Width = () => {
  const { me, state } = useSelector((state) => state.user);
  const { logOutDone, loadWidthDone } = useSelector(
    (state) => state.user.state
  );
  const { calendar } = useSelector((state) => state.calendar);
  const [choicedTime, setChoicedTime] = useState(new Date(calendar.choiceDate));

  const [width, setWidth] = useState(40);

  // 로그인 여부 확인
  const navigate = useNavigate();
  useEffect(() => {
    if (!me?.userEmail) {
      message.warning("로그인이 필요합니다");
      navigate("/login");
      return;
    }

    if (logOutDone) {
      navigate("/");
      return;
    }
  }, [logOutDone]);

  const onChangeWidth = (event) => {
    if (event.target.value <= 0) {
      setWidth("");
    } else {
      setWidth(event.target.value);
    }
  };

  const dispatch = useDispatch();

  // 바로 이전에 기록한 체중을 Input value로 지정해줌 , 기록이 없다면 반영X
  useEffect(() => {
    if (state.loadWidthDone && me?.width?.[0]) {
      setWidth(me.width[0].width);
    }
  }, [state.loadWidthDone]);

  useEffect(() => {
    if (me) {
      dispatch({
        type: LOAD_WIDTH_REQUEST,
        data: { date: new Date(choicedTime) },
      });
    }
  }, []);

  const onClickWidthSaveBtn = (event) => {
    event.preventDefault();
    dispatch({
      type: WIDTH_WRITE_REQUEST,
      data: {
        userId: me.id,
        selectedDate: calendar.choiceDate,
        width,
        date: new Date(choicedTime),
      },
    });
    console.log(width);
  };

  const onClickDate = (date) => {
    dispatch({
      type: CHANGE_SELECT_DATE_REQUEST,
      data: new Date(date),
    });
  };

  useEffect(() => {
    setChoicedTime(calendar.choiceDate);
    if (loadWidthDone) {
      dispatch({
        type: CHANGE_SELECT_DATE_REQUEST,
        data: calendar.choiceDate,
      });
    }
  }, [calendar.choiceDate]);

  return (
    <div className="widthPage">
      <div className="recodeSectionWrapper">
        <section className="recodeInputContainer">
          <WeekCalendar eventHandler={onClickDate}></WeekCalendar>

          <form className="widthInputForm">
            <div className="formTextbox">
              <input
                className="formTextboxInput"
                id="exerciseTimeInput"
                type="number"
                step="0.1"
                value={width}
                onChange={onChangeWidth}
                min="0"
                required
              ></input>
              <label className="formTextboxLabel" htmlFor="exerciseTimeInput">
                얼마의 몸무게가 나오셨나요? (Kg)
              </label>
            </div>
            <div className="btnWrapper">
              <button onClick={() => navigate(-1)}>돌아가기</button>
              <button onClick={onClickWidthSaveBtn}>Save</button>
            </div>
          </form>
        </section>
        <section className="widthListWrapper">
          {me?.width &&
            me.width
              .filter((width) => {
                return (
                  `${new Date(width.date)}` ===
                  `${new Date(calendar.choiceDate)}`
                );
              })
              .map((data) => {
                return (
                  <UserWidthItem key={data.id} data={data}></UserWidthItem>
                );
              })}
        </section>
      </div>
    </div>
  );
};

export default Width;
