import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

const WeekCalendar = ({ eventHandler }) => {
  const [date, setDate] = useState([]);
  const [week, setWeek] = useState([]);

  const days = ["일", "월", "화", "수", "목", "금", "토"];

  const choiceDate = useSelector((state) => state.calendar.calendar.choiceDate);

  /** 오늘을 기준으로 일주일 치 Date 객체로 이루어 진 배열을 생성, state에 저장 */
  const makeWeekArr = (date) => {
    let day = date.getDay();
    let week = [];
    for (let i = 0; i < 7; i++) {
      let newDate = new Date(date.valueOf() + 86400000 * (i - day));
      week.push([i, newDate]);
    }
    return week;
  };

  /** 컴포넌트 Didmount 에 State를 설정  */
  useEffect(() => {
    let now = new Date(choiceDate);
    let date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let week = makeWeekArr(date);
    setDate(date);
    setWeek(week);
  }, [choiceDate]);

  /** 전주, 다음주 버튼 실행 시 새로운 week 배열 만들기 */

  const onPressArrowLeft = () => {
    let newDate = new Date(date.valueOf() - 86400000 * 7);
    let newWeek = makeWeekArr(newDate);
    setDate(newDate);
    setWeek(newWeek);
  };

  const onPressArrowRight = () => {
    let newDate = new Date(date.valueOf() + 86400000 * 7);
    let newWeek = makeWeekArr(newDate);
    setDate(newDate);
    setWeek(newWeek);
  };

  const WeekCalendarRef = useRef();

  useEffect(() => {
    const onScrollWeekCalendar = (e) => {
      const { deltaY } = e;
      const date = new Date(choiceDate);

      if (deltaY > 0) {
        // 스크롤 내릴 때
        eventHandler(date.setDate(date.getDate() + 1));
      } else {
        // 스크롤 올릴때
        eventHandler(date.setDate(date.getDate() - 1));
      }
      e.preventDefault();
      e.stopImmediatePropagation();
    };

    const outerDivRefCurrent = WeekCalendarRef.current;
    outerDivRefCurrent.addEventListener("wheel", onScrollWeekCalendar);
    return () => {
      outerDivRefCurrent.removeEventListener("wheel", onScrollWeekCalendar);
    };
  }, [choiceDate]);

  return (
    <div className="WeekCalendarComponent" ref={WeekCalendarRef}>
      <header>
        <button onClick={onPressArrowLeft}>{`<`}</button>
        <p>{`${new Date(date)?.getFullYear()}.${
          new Date(date)?.getMonth() + 1
        }`}</p>
        <button onClick={onPressArrowRight}>{`>`}</button>
      </header>
      <div className="weekCalendarBody">
        <div className="dayOfTheWeek">
          {week.map((e) => {
            return (
              <span className="weekCalendarDays" key={e[0]}>
                {days[e[0]]}
              </span>
            );
          })}
        </div>
        <div className="weeklyDate">
          {week.map((e) => {
            let date = new Date(choiceDate);
            let selectedDate = new Date(e[1]);

            return (
              <span
                className={
                  date?.getMonth() === selectedDate?.getMonth() &&
                  date?.getDate() === selectedDate?.getDate()
                    ? `${"weekCalendarDate"} ${"weekCalendarDate-active"}`
                    : "weekCalendarDate"
                }
                key={e[0]}
                onClick={() => {
                  eventHandler(e[1]);
                }}
              >
                {new Date(e[1]).getDate()}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WeekCalendar;
