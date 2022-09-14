import React, { useState } from "react";
import Modal from "./Modal";
import { timeForToday } from "../util/function";
import { REMOVE_WIDTH_REQUEST } from "../modules/reducers/user";
import { useDispatch } from "react-redux";

const UserWidthItem = ({ data }) => {
  const [removeRecordModalOpen, setRemoveRecordModalOpen] = useState(false);

  const timestamp = (date) => {
    const today = new Date(date);
    const days = ["일", "월", "화", "수", "목", "금", "토"];

    return `${today.getFullYear()}. ${
      today.getMonth() + 1
    }. ${today.getDate()}. ${days[today.getDay()]}`;
  };

  const dispatch = useDispatch();

  /** removeWidth Dispatch를 하는 함수 */
  const onClickWidthRemoveBtn = () => {
    dispatch({
      type: REMOVE_WIDTH_REQUEST,
      data: { WidthId: data.id },
    });
  };

  console.log(data);

  return (
    <div className="UserWidthItemComponent">
      <div key={data.id}>
        <p>{`${timestamp(data.date)}`}</p>
        <div>{`${data.width} Kg`}</div>
        {/* <button
                onClick={() => {
                  eventHandler(e);
                }}
              >
                지우기
              </button> */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setRemoveRecordModalOpen((prev) => !prev);
          }}
        >
          기록 삭제
        </button>
        {removeRecordModalOpen && (
          <Modal
            innerContents={
              <span>{`${timeForToday(data.createdAt)} 정성스럽게 작성한
                    ${data.width} 기록을 정말로 삭제할까요? 😢`}</span>
            }
            closeMessage="돌아가기"
            okMessage="삭제합니다"
            okAction={() => {
              onClickWidthRemoveBtn(data);
            }}
            closeAction={() => {
              setRemoveRecordModalOpen(false);
            }}
          ></Modal>
        )}
      </div>
    </div>
  );
};

export default UserWidthItem;
