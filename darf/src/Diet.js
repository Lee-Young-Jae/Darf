import { message } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DietItem from "./components/DietItem";
import WeekCalendar from "./components/WeekCalendar";
import {
  CHANGE_SELECT_DATE_REQUEST,
  GET_FOOD_DETAIL_REQUEST,
} from "./modules/reducers/calendar";
import { LOAD_REGISTED_GROUP_REQUEST } from "./modules/reducers/group";
import {
  DIET_WRITE_REQUEST,
  LOAD_DIET_REQUEST,
  UPLOAD_IMAGES_REQUEST,
} from "./modules/reducers/user";

import { foodTypes, days } from "./util/function";

const Diet = () => {
  const [searchFoodName, setSearchFoodName] = useState("");
  const [foodName, setFoodName] = useState("");
  const [foodKcal, setfoodKcal] = useState();
  const [foodType, setFoodType] = useState("");
  const [viewEntireDiet, setViewEntireDiet] = useState(false);

  const { me } = useSelector((state) => state.user);

  const { calendar } = useSelector((state) => state.calendar);
  const { loadDietListDone, logOutDone } = useSelector(
    (state) => state.user.state
  );

  const imagePaths = useSelector((state) => state.user.imagePaths);
  const [choicedTime, setChoicedTime] = useState(new Date(calendar.choiceDate));
  const dispatch = useDispatch();
  const imageInput = useRef();
  const searchBox = useRef();
  useEffect(() => {
    searchBox.current.focus();
    dispatch({
      type: LOAD_DIET_REQUEST,
      data: 0,
    });
  }, [dispatch]);

  const getFoodDetail = useCallback(() => {
    dispatch({
      type: GET_FOOD_DETAIL_REQUEST,
      data: searchFoodName,
    });
  }, [dispatch, searchFoodName]);

  const onClickFoodDiet = useCallback((element) => {
    setFoodName(element.name);
    setfoodKcal(element.kcal);
  }, []);

  const onChangeImages = useCallback(
    (e) => {
      e.preventDefault();
      const imageFormData = new FormData();
      [].forEach.call(e.target.files, (f) => {
        imageFormData.append("image", f); //back의 upload.array("image") 키워드가 같아야한다.
      });
      dispatch({
        type: UPLOAD_IMAGES_REQUEST,
        data: imageFormData,
      });
    },
    [dispatch]
  );

  useEffect(() => {
    setChoicedTime(calendar.choiceDate);
  }, [calendar.choiceDate]);

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

  const onSubmitDiet = useCallback(
    (e) => {
      e.preventDefault();
      if (!foodType || foodType?.length <= 0) {
        message.info("음식 종류를 선택해 주세요.", "");
        return;
      }
      if (!foodName || foodName?.length <= 0) {
        message.info("음식 이름을 입력해 주세요.", "");
        return;
      }
      if (!foodKcal || foodKcal?.length <= 0) {
        message.info("음식 칼로리를 입력해 주세요.", "");
        return;
      }

      const formData = new FormData();
      imagePaths.forEach((path) => {
        formData.append("image", path); //key image  backend 에서는 req.body.image
      });
      formData.append("type", foodType); // key content backend 에서는 req.body.content //multer가 file인 경우엔 배열이면 req.files 싱글이면 req.file에 넣어주지만 img나 file이 아닐 경우 req.body에 넣어준다.
      formData.append("name", foodName);
      formData.append("kcal", foodKcal);
      formData.append("name", foodName);
      formData.append("date", new Date(choicedTime));
      dispatch({
        type: DIET_WRITE_REQUEST,
        data: formData, //사실 이미지가 없기 때문에 FormData 안써도 된다... json으로 보내도 됨
      });
    },
    [foodType, foodName, foodKcal, imagePaths, choicedTime, dispatch]
  );

  const onClickImageUpload = useCallback(
    (e) => {
      e.preventDefault();
      imageInput.current.click();
    },
    [imageInput.current]
  );

  const onRemoveImage = useCallback(
    (index) => () => {
      dispatch({
        // type: REMOVE_IMAGE,
        data: index,
      });
    },
    []
  );

  const onClickDate = (date) => {
    dispatch({
      type: CHANGE_SELECT_DATE_REQUEST,
      data: new Date(date),
    });
  };

  useEffect(() => {
    dispatch({ type: LOAD_REGISTED_GROUP_REQUEST });
  }, [dispatch]);

  useEffect(() => {
    // write 성공하면 state 값 초기화
    if (loadDietListDone) {
      setFoodName("");
      setFoodType("");
      setfoodKcal(0);
    }
  }, [loadDietListDone]);

  return (
    <div className="dietPage">
      {/* 여기는 Diet Page 입니다. */}
      <div className="sectionWrapper">
        <section className="dietInputWrapper">
          <WeekCalendar eventHandler={onClickDate}></WeekCalendar>
          <div className="underbar"></div>
          <div className="dietInputFormWrapper">
            <div className="FoodSearchWrapper">
              <div className="FoodSearchForm">
                <input
                  placeholder="음식을 찾아보세요!"
                  id="foodSearchInput"
                  autoComplete="off"
                  onChange={(e) => {
                    setSearchFoodName(e.target.value);
                  }}
                  onKeyUp={getFoodDetail}
                  value={searchFoodName}
                  ref={searchBox}
                ></input>
                {/* <span>🔍</span> */}
              </div>

              <div className="FoodSearchResultForm">
                {calendar.food.searchFoodDetail?.length > 1 ? (
                  calendar.food.searchFoodDetail.map((e, i) => {
                    return (
                      <div
                        className="FoodSearchResult"
                        key={i}
                        onClick={(event) => {
                          onClickFoodDiet(e, event);
                        }}
                      >
                        <p>{e.name}</p>
                        <p className="FoodKcal">{`${e.kcal} kcal`}</p>
                      </div>
                    );
                  })
                ) : (
                  <div>검색 결과가 없습니다.</div>
                )}
              </div>
            </div>
            <div>
              <form encType="multipart/form-data" onSubmit={onSubmitDiet}>
                <input
                  className="MyInput"
                  type="file"
                  name="image"
                  multiple
                  hidden
                  ref={imageInput}
                  onChange={onChangeImages}
                ></input>

                <button onClick={onClickImageUpload}>이미지 업로드</button>
                <div>
                  {imagePaths.map((item, index) => {
                    return (
                      <div key={item} style={{ display: "inline-block" }}>
                        <img
                          src={`http://localhost:3065/images/${item}`}
                          alt={item}
                          style={{ width: "200px" }}
                        ></img>

                        <div>
                          <button onClick={onRemoveImage(index)}>제거</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="formTextbox">
                  <input
                    className="formTextboxInput"
                    id="name"
                    type="text"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    required
                    autoComplete="off"
                  ></input>
                  <label className="formTextboxLabel" htmlFor="name">
                    무엇을 드셨나요?
                  </label>
                </div>
                <div className="formTextbox">
                  <input
                    className="formTextboxInput"
                    id="kcal"
                    type="number"
                    onChange={(e) => setfoodKcal(e.target.value)}
                    value={foodKcal}
                    required
                    autoComplete="off"
                  ></input>
                  <label className="formTextboxLabel" htmlFor="kcal">
                    Kcal
                  </label>
                </div>
                <p>저는 "{foodName}" 를</p>
                <div className="FoodTypeBox">
                  {foodTypes.map((e) => {
                    return (
                      <span
                        className={`${"FoodType"} ${
                          foodType === e.type ? "FoodType-active" : ""
                        }`}
                        key={e.id}
                        id={e.type}
                        onClick={() => {
                          setFoodType(e.type);
                        }}
                      >
                        {e.type}
                      </span>
                    );
                  })}
                </div>
                <p>로 먹었어요</p>
                <div className="btnWrapper">
                  <button onClick={() => navigate(-1)}>돌아가기</button>
                  <button>입력</button>
                </div>
              </form>
            </div>
          </div>
        </section>
        <section className="dietListWrapper">
          <button
            onClick={() => {
              setViewEntireDiet((prev) => !prev);
            }}
          >
            {viewEntireDiet ? "전체보기" : "선택한 날짜만 보기"}
          </button>
          <div className="DietList">
            <div
              className={`${
                foodName?.length >= 1 ||
                foodKcal?.length >= 1 ||
                foodType?.length >= 1
                  ? "DietItem-visible"
                  : "DietItem-nonvisible"
              }`}
            >
              <div>{`${new Date(choicedTime).getFullYear()}. ${
                new Date(choicedTime).getMonth() + 1
              }. ${new Date(choicedTime).getDate()}. ${
                days[new Date(choicedTime).getDay()]
              }`}</div>
              <p>{foodName}</p>
              <p>{foodKcal ? `${foodKcal} kcal` : null} </p>
              <p>{foodType ? `"${foodType}" 으로 먹었음` : null}</p>
            </div>
          </div>
          {viewEntireDiet ? (
            <div className="DietList">
              {me?.diet?.map((e) => {
                return <DietItem key={e.id} data={e}></DietItem>;
              })}
            </div>
          ) : (
            <div className="DietList">
              {me?.diet
                ?.filter((diet) => {
                  return (
                    `${new Date(diet.date)}` ===
                    `${new Date(calendar.choiceDate)}`
                  );
                })
                .map((e) => {
                  return <DietItem key={e.id} data={e}></DietItem>;
                })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Diet;
