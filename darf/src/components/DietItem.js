import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CREATE_GROUP_POST_REQUEST } from "../modules/reducers/group";
import { REMOVE_DIET_REQUEST } from "../modules/reducers/user";
import Modal from "./Modal";
import { days, timeForToday } from "../util/function";

const DietItem = ({ data }) => {
  const now = new Date(data.date);
  const { group } = useSelector((state) => state.group);

  const [shareRecordsAsGroup, setShareRecordsAsGroup] = useState();
  const { createGroupPostDone } = useSelector((state) => state.group.state);
  const [removeRecordModalOpen, setRemoveRecordModalOpen] = useState(false);
  const dispatch = useDispatch();

  const onclickSharedBtn = (group, postData) => {
    dispatch({
      type: CREATE_GROUP_POST_REQUEST,
      data: {
        posttype: "Diet",
        groupId: group.id,
        name: postData.name,
        type: postData.type,
        kcal: postData.kcal,
        image: JSON.stringify(postData.DietImages.map((image) => image.src)),
        date: postData.date,
      },
    });
  };

  const onClickRemoveBtn = (postData) => {
    dispatch({
      type: REMOVE_DIET_REQUEST,
      data: { dietId: postData.id },
    });
  };

  /* <img
                key={image.id}
                src={`http://localhost:3065/images/${image.src}`}
                alt={image.src}
              ></img> */

  /** 그룹에 공유 성공하면 공유 팝업창 닫고 message 출력 */
  useEffect(() => {
    if (createGroupPostDone) {
      setShareRecordsAsGroup(false);
    }
  }, [createGroupPostDone]);

  return (
    <div className="DietItem">
      <div>
        <div>{`${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}. ${
          days[now.getDay()]
        }`}</div>
      </div>
      {data?.DietImages ? (
        data.DietImages.map((image) => {
          return (
            <div className="dietImageWrapper" key={image.id}>
              <img
                src={`http://localhost:3065/images/${image.src}`}
                alt={image.src}
              ></img>
            </div>
          );
        })
      ) : (
        <div>이미지가 존재하지 않습니다.</div>
      )}
      <div>{data.name}</div>
      <div>{`${Math.round(data.kcal)}칼로리 섭취`}</div>
      <div>{data.type}</div>
      <button
        onClick={(e) => {
          e.preventDefault();
          setRemoveRecordModalOpen((prev) => !prev);
          console.log(removeRecordModalOpen);
        }}
      >
        기록 삭제
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

      <div>
        <button onClick={() => setShareRecordsAsGroup((prev) => !prev)}>
          그룹에 공유하기
        </button>
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
    </div>
  );
};

export default DietItem;
