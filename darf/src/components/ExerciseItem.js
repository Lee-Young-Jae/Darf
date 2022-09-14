import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_GROUP_POST_REQUEST } from "../modules/reducers/group";
import { REMOVE_EXERCISE_REQUEST } from "../modules/reducers/user";
import Modal from "./Modal";

const ExerciseItem = ({ data }) => {
  const [shareRecordsAsGroup, setShareRecordsAsGroup] = useState();
  const { group } = useSelector((state) => state.group);
  const { createGroupPostDone } = useSelector((state) => state.group.state);

  const days = ["일", "월", "화", "수", "목", "금", "토"];

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
    <div className="ExerciseItem" key={data.id}>
      <div>
        {`${date?.getFullYear()}. ${
          date?.getMonth() + 1
        }. ${date?.getDate()}. ${days[date?.getDay()]}`}
      </div>
      <div>{data.name}</div>
      <div>{data.type}</div>
      <div>{data.bodyPart}</div>
      <div>{data.intensity}</div>
      <div>{data.minute}분</div>
      <button
        onClick={() => {
          onClickRemoveBtn(data);
        }}
      >
        기록 삭제
      </button>
      <span onClick={() => setShareRecordsAsGroup((prev) => !prev)}>
        그룹에 공유하기
      </span>
      {shareRecordsAsGroup && (
        <Modal
          closeMessage="닫기"
          closeAction={() => {
            setShareRecordsAsGroup(false);
          }}
          innerContents={
            <div>
              <span>어느 그룹에 공유할까요?</span>
              {group.myGroup?.map((group) => {
                return (
                  <div key={group.id} className="groupCard">
                    <span className="emoji-mini-black">{group.emoji}</span>

                    <button
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
    </div>
  );
};

export default ExerciseItem;
