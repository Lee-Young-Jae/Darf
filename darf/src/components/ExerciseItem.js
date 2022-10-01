import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_GROUP_POST_REQUEST } from "../modules/reducers/group";
import { REMOVE_EXERCISE_REQUEST } from "../modules/reducers/user";
import Modal from "./Modal";
import { timeForToday } from "../util/function";
// import { days } from "../util/publicData";

const ExerciseItem = ({ data }) => {
  const [shareRecordsAsGroup, setShareRecordsAsGroup] = useState();
  const { group } = useSelector((state) => state.group);
  const { createGroupPostDone } = useSelector((state) => state.group.state);
  const [removeRecordModalOpen, setRemoveRecordModalOpen] = useState(false);

  const dispatch = useDispatch();

  const onclickSharedBtn = (group, postData) => {
    dispatch({
      type: CREATE_GROUP_POST_REQUEST,
      data: {
        posttype: "Exercise",
        type: postData.type,
        groupId: group.id,
        name: postData.name,
        bodyPart: postData.bodyPart,
        intensity: postData.intensity,
        image: postData.image,
        date: postData.date,
        minute: postData.minute,
      },
    });
  };

  const date = new Date(data.date);

  const onClickRemoveBtn = (data) => {
    dispatch({ type: REMOVE_EXERCISE_REQUEST, data: { exerciseId: data.id } });
  };

  /** 그룹에 공유 성공하면 공유 팝업창 닫고 message 출력 */
  useEffect(() => {
    if (createGroupPostDone) {
      setShareRecordsAsGroup(false);
    }
  }, [createGroupPostDone]);

  return (
    <div className="ExerciseItem userHealthRecodeItem" key={data.id}>
      {/* <div>
        {`${date?.getFullYear()}. ${
          date?.getMonth() + 1
        }. ${date?.getDate()}. ${days[date?.getDay()]}`}
      </div> */}

      <div className="recodeContent">
        <span>{data.name} / </span>
        <span>
          {JSON.parse(data.bodyPart).map((bodyPart, index) =>
            JSON.parse(data.bodyPart).length === index + 1 ? (
              <span>{bodyPart} </span>
            ) : (
              <span> {`${bodyPart}, `} </span>
            )
          )}
        </span>
        /
        <span>
          {JSON.parse(data.intensity).map((intensity, index) =>
            JSON.parse(data.intensity).length === index + 1 ? (
              <span> {intensity} </span>
            ) : (
              <span>{` ${intensity}, `}</span>
            )
          )}
        </span>
        /<span> {data.minute}분</span>
      </div>
      <div className="btnWrapper">
        <button
          className="sharedBtn"
          onClick={() => setShareRecordsAsGroup((prev) => !prev)}
        >
          {/* 그룹에 공유하기 */}
        </button>
        {shareRecordsAsGroup && (
          <Modal
            closeMessage="닫기"
            closeAction={() => {
              setShareRecordsAsGroup(false);
            }}
            innerContents={
              <div className="shareToGroupModalWrapper">
                <span className="title">어느 그룹에 공유할까요?</span>
                {group.myGroup?.map((group) => {
                  return (
                    <div key={group.id} className="groupCard">
                      <span className="emoji-mini-black">{group.emoji}</span>

                      <button
                        className="shareBtn"
                        onClick={() => {
                          onclickSharedBtn(group, data);
                        }}
                      >
                        {group.name}
                      </button>
                    </div>
                  );
                })}
              </div>
            }
          ></Modal>
        )}
        <button
          className="deleteBtn"
          onClick={(e) => {
            e.preventDefault();
            setRemoveRecordModalOpen((prev) => !prev);
          }}
        >
          {/* 기록 삭제 */}
        </button>
        {removeRecordModalOpen && (
          <Modal
            innerContents={
              <span>{`${timeForToday(data.createdAt)} 정성스럽게 작성한
              ${data.name} 기록을 정말로 삭제할까요? 😢`}</span>
            }
            closeMessage="돌아가기"
            okMessage="삭제합니다"
            okAction={() => {
              onClickRemoveBtn(data);
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

export default ExerciseItem;
