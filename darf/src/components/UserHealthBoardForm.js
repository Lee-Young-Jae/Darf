import React from "react";

const UserHealthBoardForm = ({ data, eventHandler }) => {
  const timestamp = (date) => {
    const today = new Date(date);
    const days = ["일", "월", "화", "수", "목", "금", "토"];

    return `${today.getFullYear()}. ${
      today.getMonth() + 1
    }. ${today.getDate()}. ${days[today.getDay()]}`;
  };

  return (
    <div className="UserHealthBoardForm">
      <ul>
        {data.map((e) => {
          return (
            <li key={e.id}>
              <p>{`${timestamp(e.date)}`}</p>
              <div>{`${e.width} Kg`}</div>
              <button
                onClick={() => {
                  eventHandler(e);
                }}
              >
                지우기
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default UserHealthBoardForm;
