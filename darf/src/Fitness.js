import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ExerciseItem from "./components/ExerciseItem";
import WeekCalendar from "./components/WeekCalendar";
import { CHANGE_SELECT_DATE_REQUEST } from "./modules/reducers/calendar";
import { LOAD_REGISTED_GROUP_REQUEST } from "./modules/reducers/group";
import {
  EXERCISE_WRITE_REQUEST,
  LOAD_EXERCISE_REQUEST,
} from "./modules/reducers/user";

const Fitness = () => {
  const [exerciseName, setExerciseName] = useState("");
  const [exerciseType, setExerciseType] = useState(new Set());
  const [exerciseBodyPart, setExerciseBodyPart] = useState(new Set());
  const [exerciseIntensity, setExerciseIntensity] = useState(new Set());
  const [exerciseMinute, setExerciseMinute] = useState(5);
  const [viewEntireExercise, setViewEntireExercise] = useState(false);

  const [exerciseTypeOpen, setExerciseTypeOpen] = useState(false);
  const [exerciseBodyPartOpen, setExerciseBodyPartOpen] = useState(false);
  const [exerciseIntensityOpen, setExerciseIntensityOpen] = useState(false);

  const { me } = useSelector((state) => state.user);
  const { ExerciseWriteDone, loadExerciseDone, logOutDone } = useSelector(
    (state) => state.user.state
  );

  const { calendar } = useSelector((state) => state.calendar);
  const days = [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ];
  const [choicedTime, setChoicedTime] = useState(new Date(calendar.choiceDate));

  const formTypeData = [
    { id: 1, type: "무산소운동" },
    { id: 2, type: "유산소운동" },
    { id: 3, type: "스트레칭" },
  ];
  const formBodypartData = [
    { id: 1, part: "전신" },
    { id: 2, part: "상체" },
    { id: 3, part: "하체" },
    { id: 4, part: "팔" },
    { id: 5, part: "등" },
    { id: 6, part: "어깨" },
    { id: 7, part: "가슴" },
    { id: 8, part: "복근" },
  ];
  const formIntensityData = [
    { id: 1, intensity: "강하게" },
    { id: 2, intensity: "보통" },
    { id: 3, intensity: "쉽게" },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: LOAD_EXERCISE_REQUEST,
    });
  }, [dispatch]);

  /** 운동 기록이 모두 로드 되면 선택한 요일만의 기록도 로드 */

  /** 기록 입력 Done 시 state 값들 초기화  */
  useEffect(() => {
    if (ExerciseWriteDone) {
      setExerciseName("");
      setExerciseType(new Set());
      setExerciseBodyPart(new Set());
      setExerciseIntensity(new Set());
      setExerciseMinute(5);
      document
        .querySelectorAll(".checkListItem input")
        .forEach(function (v, i) {
          v.checked = false;
        });
    }
  }, [ExerciseWriteDone]);

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

  const onSubmitExercise = (e) => {
    e.preventDefault();

    if (exerciseName.length <= 0) {
      message.info("운동명을 입력해주세요");
      return;
    }
    if (Array.from(exerciseType).length <= 0) {
      message.info("운동 종류를 선택해주세요");
      return;
    }
    if (Array.from(exerciseBodyPart)?.length <= 0) {
      message.info("운동 부위를 선택해주세요");
      return;
    }
    if (Array.from(exerciseIntensity)?.length <= 0) {
      message.info("운동 강도를 선택해주세요");
      return;
    }

    dispatch({
      type: EXERCISE_WRITE_REQUEST,
      data: {
        name: exerciseName,
        minute: exerciseMinute,
        date: new Date(choicedTime),
        type: JSON.stringify(Array.from(exerciseType)),
        bodyPart: JSON.stringify(Array.from(exerciseBodyPart)),
        intensity: JSON.stringify(Array.from(exerciseIntensity)),
      },
    });
  };

  const onChangeCheckHandler = (e) => {
    if (e.target.id.includes("type")) {
      checkedItemHandler(
        e.target.parentNode,
        e.target.value,
        e.target.checked,
        exerciseType,
        setExerciseType
      );
    }

    if (e.target.id.includes("part")) {
      checkedItemHandler(
        e.target.parentNode,
        e.target.value,
        e.target.checked,
        exerciseBodyPart,
        setExerciseBodyPart
      );
    }

    if (e.target.id.includes("intensity")) {
      checkedItemHandler(
        e.target.parentNode,
        e.target.value,
        e.target.checked,
        exerciseIntensity,
        setExerciseIntensity
      );
    }
  };

  const checkedItemHandler = (box, id, isChecked, target, setTarget) => {
    if (isChecked) {
      target.add(id);
      setTarget(new Set(target));
      // box.style.backgroundColor = "#F6CB44";
    } else if (!isChecked && target.has(id)) {
      target.delete(id);
      setTarget(new Set(target));
      // box.style.backgroundColor = "#FFF";
    }
    return target;
  };

  const onChangeExerciseMinute = (e) => {
    setExerciseMinute(e.target.value);
  };

  const onClickDate = (date) => {
    dispatch({
      type: CHANGE_SELECT_DATE_REQUEST,
      data: new Date(date),
    });
  };

  useEffect(() => {
    setChoicedTime(calendar.choiceDate);
    if (loadExerciseDone) {
      dispatch({
        type: CHANGE_SELECT_DATE_REQUEST,
        data: calendar.choiceDate,
      });
    }
  }, [calendar.choiceDate]);

  useEffect(() => {
    dispatch({ type: LOAD_REGISTED_GROUP_REQUEST });
  }, [dispatch]);

  return (
    <div className="exercisePage">
      <div className="recodeSectionWrapper">
        <section className="recodeInputContainer">
          <WeekCalendar eventHandler={onClickDate}></WeekCalendar>
          <div className="underbar"></div>
          {/* <h2>{`${choicedTime.getFullYear()}. ${
            choicedTime.getMonth() + 1
          }. ${choicedTime.getDate()}. ${days[choicedTime.getDay()]}`}</h2> */}
          <div>
            <form
              encType="multipart/form-data"
              onSubmit={onSubmitExercise}
              className="exerciseInputForm"
            >
              <div className="formTextbox">
                <input
                  id="exerciseNameInput"
                  type="text"
                  className="formTextboxInput"
                  value={exerciseName}
                  onChange={(e) => {
                    setExerciseName(e.target.value);
                  }}
                  autoComplete="off"
                  required
                ></input>
                <label className="formTextboxLabel" htmlFor="exerciseNameInput">
                  어떤 활동을 하셨나요?
                </label>
              </div>
              <div className="formTextbox">
                <input
                  className="formTextboxInput"
                  id="exerciseTimeInput"
                  type="number"
                  step="5"
                  value={exerciseMinute}
                  onChange={onChangeExerciseMinute}
                  min="0"
                  required
                ></input>
                <label className="formTextboxLabel" htmlFor="exerciseTimeInput">
                  얼마나 하셨나요?
                </label>
              </div>
              <div>
                <div
                  className="cursorPointer"
                  onClick={() => {
                    setExerciseTypeOpen((prev) => !prev);
                  }}
                >
                  운동 종류:
                </div>
                <div className="checkList">
                  {exerciseTypeOpen &&
                    formTypeData.map((e) => {
                      return (
                        <div key={e.id} className="checkListItem">
                          <input
                            type="checkbox"
                            value={e.type}
                            id={`type-${e.type}`}
                            onChange={onChangeCheckHandler}
                          ></input>
                          <label htmlFor={`type-${e.type}`}>{e.type}</label>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div>
                <div
                  className="cursorPointer"
                  onClick={() => {
                    setExerciseBodyPartOpen((prev) => !prev);
                  }}
                >
                  운동 부위:{" "}
                </div>
                <div className="checkList">
                  {exerciseBodyPartOpen &&
                    formBodypartData.map((e) => {
                      return (
                        <div key={e.id} className="checkListItem">
                          <input
                            type="checkbox"
                            value={e.part}
                            id={`part-${e.part}`}
                            onChange={onChangeCheckHandler}
                          ></input>
                          <label htmlFor={`type-${e.part}`}>{e.part}</label>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div>
                <div
                  className="cursorPointer"
                  onClick={() => {
                    setExerciseIntensityOpen((prev) => !prev);
                  }}
                >
                  운동 강도:{" "}
                </div>
                <div className="checkList">
                  {exerciseIntensityOpen &&
                    formIntensityData.map((e) => {
                      return (
                        <div key={e.id} className="checkListItem">
                          <input
                            type="checkbox"
                            value={e.intensity}
                            id={`intensity-${e.intensity}`}
                            onChange={onChangeCheckHandler}
                          ></input>
                          <label htmlFor={`intensity-${e.intensity}`}>
                            {e.intensity}
                          </label>
                        </div>
                      );
                    })}
                </div>
              </div>
              <div className="btnWrapper">
                <button onClick={() => navigate(-1)}>돌아가기</button>
                <button>입력</button>
              </div>
            </form>
          </div>
        </section>
        <section className="exerciseListWrapper">
          <button
            onClick={() => {
              setViewEntireExercise((prev) => !prev);
            }}
          >
            {viewEntireExercise ? "전체보기" : "선택한 날짜만 보기"}
          </button>
          <div className="ExerciseList">
            <div
              className={`ExerciseItem-${
                exerciseName?.length >= 1 ||
                Array.from(exerciseType)?.length >= 1 ||
                Array.from(exerciseBodyPart)?.length >= 1 ||
                Array.from(exerciseIntensity)?.length >= 1
                  ? "visible"
                  : "nonvisible"
              }`}
            >
              <p>{`${new Date(calendar.choiceDate).getFullYear()}. ${
                new Date(calendar.choiceDate).getMonth() + 1
              }. ${new Date(calendar.choiceDate).getDate()}. ${days[
                new Date(calendar.choiceDate).getDay()
              ].charAt(0)}`}</p>
              <p>{`${exerciseName}`}</p>
              <p>{`${Array.from(exerciseType).map((e) => {
                return e;
              })}`}</p>
              <p>{`${Array.from(exerciseBodyPart).map((e) => {
                return e;
              })}`}</p>
              <p>{`${Array.from(exerciseIntensity).map((e) => {
                return e;
              })}`}</p>
              <p>{`[${exerciseMinute}] 분`}</p>
            </div>
          </div>
          {viewEntireExercise ? (
            <div className="ExerciseList">
              {me?.exercise?.length >= 0 &&
                me.exercise.map((e) => {
                  return <ExerciseItem key={e.id} data={e}></ExerciseItem>;
                })}
            </div>
          ) : (
            // 이거 프론트에 부담 엄청 갈꺼같아서 수정해야할것 같아용
            <div className="ExerciseList">
              {me?.exercise?.filter((exercise) => {
                return (
                  `${new Date(exercise.date)}` ===
                  `${new Date(calendar.choiceDate)}`
                );
              })?.length > 0 ? (
                me?.exercise
                  ?.filter((exercise) => {
                    return (
                      `${new Date(exercise.date)}` ===
                      `${new Date(calendar.choiceDate)}`
                    );
                  })
                  .map((e) => {
                    return <ExerciseItem key={e.id} data={e}></ExerciseItem>;
                  })
              ) : (
                <div className="ExerciseItem">
                  기록이 없습니다 새로 작성해 보세요!
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Fitness;
