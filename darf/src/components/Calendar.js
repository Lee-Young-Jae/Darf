import React, { useEffect, useState } from "react";
import MyButton from "./MyButton";
import MyModal from "./MyModal";

import {
  OPEN_POPUP_REQUEST,
  CLOSE_POPUP_REQUEST,
} from "../modules/reducers/calendar";
import { useDispatch, useSelector } from "react-redux";

const Calender = () => {
  const dispatch = useDispatch();

  const { calendar } = useSelector((state) => state.calendar);

  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const [prevMonth, setPrevMonth] = useState([]);
  const [thisMonth, setThisMonth] = useState([]);
  const [nextMonth, setNextMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDetailPopup, setOpenDetailPopup] = useState(false);

  useEffect(() => {
    setPrevMonth([]);
    setThisMonth([]);
    setNextMonth([]);

    const date = selectedDate; // 현재 날짜(로컬 기준) 가져오기

    // 시작일은 어짜피 1일부터이므로 시작날짜는 필요 없지만 마지막 날 날짜는 매달 다르기 때문에 따로 가져와야함,
    // 또한 요일도 표시하기 위해 첫날과 마지막 날의 요일도 가져오기.

    //이전 달의 마지막 날 날짜와 요일 구하기
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    // 전달
    const startDay = new Date(currentYear, currentMonth, 0);
    const prevDate = startDay.getDate(); //마지막 날짜
    const prevDay = startDay.getDay(); //마지막 요일

    //이번달
    const endDay = new Date(currentYear, currentMonth + 1, 0);
    const nextDate = endDay.getDate(); //마지막 날짜
    const nextDay = endDay.getDay(); //마지막 요일

    // 달력에 전달 마지막 날짜 표시
    let tempArr = [];
    for (let i = prevDate - prevDay; i <= prevDate; i++) {
      tempArr.push(i);
    }
    setPrevMonth(tempArr);
    tempArr = [];

    // 달력에 이번달 표시
    for (let i = 1; i <= nextDate; i++) {
      tempArr.push(i);
    }
    setThisMonth(tempArr);
    tempArr = [];

    // 달력에 다음달 첫 날짜 표시
    for (let i = 1; i < (7 - nextDay >= 7 ? 0 : 7 - nextDay); i++) {
      tempArr.push(i);
    }
    setNextMonth(tempArr);
  }, [selectedDate]);

  const decreaseMonth = () => {
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() - 1,
        selectedDate.getDate()
      )
    );
  };

  const increaseMonth = () => {
    setSelectedDate(
      new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        selectedDate.getDate()
      )
    );
  };

  const onClickDate = (e) => () => {
    setOpenDetailPopup(true);

    dispatch({
      type: OPEN_POPUP_REQUEST,
      data: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), e),
    });
    return;
  };

  const closePopup = () => {
    dispatch({
      type: CLOSE_POPUP_REQUEST,
      data: new Date(selectedDate.getFullYear(), selectedDate.getMonth()),
    });
  };

  return (
    <div className="Calender">
      <div className="CalenderHeader">
        <MyButton text={"<"} onClick={decreaseMonth}></MyButton>
        <div className="HeaderMonth">{`${selectedDate.getFullYear()}. ${
          selectedDate.getMonth() + 1
        }.`}</div>
        <MyButton text={">"} onClick={increaseMonth}></MyButton>
      </div>
      <div className="CalenderBody">
        <div className="DayWeek">
          {days.map((e) => (
            <div className="Day" key={e}>
              {e}
            </div>
          ))}
        </div>
        <div className="Date">
          {prevMonth.map((e) => {
            return (
              <div
                key={e}
                onClick={decreaseMonth}
                className="DateItem PrevMonthDate"
              >
                {e}
              </div>
            );
          })}
          {thisMonth.map((e) => {
            const today = new Date().getDate();

            if (today === e) {
              return (
                <div
                  key={e}
                  className="DateItem ThisMonthDate Today"
                  onClick={onClickDate(e)}
                >
                  {e}
                </div>
              );
            }

            return (
              <div
                key={e}
                onClick={onClickDate(e)}
                className="DateItem ThisMonthDate"
              >
                {e}
              </div>
            );
          })}
          {nextMonth.map((e) => {
            return (
              <div
                key={e}
                onClick={increaseMonth}
                className="DateItem NextMonthDate"
              >
                {e}
              </div>
            );
          })}
        </div>
      </div>
      <div>
        {openDetailPopup ? (
          <MyModal
            title={`${calendar.choiceDate}`}
            message="작성할 항목을 선택해 주세요."
            onClick={() => {
              setOpenDetailPopup(false);
            }}
          ></MyModal>
        ) : null}
      </div>
    </div>
  );
};

export default Calender;
