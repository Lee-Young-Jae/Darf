import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import axios from "axios";
import {
  OPEN_POPUP_REQUEST,
  OPEN_POPUP_SUCCESS,
  OPEN_POPUP_FAILURE,
  CLOSE_POPUP_REQUEST,
  CLOSE_POPUP_SUCCESS,
  CLOSE_POPUP_FAILURE,
  GET_FOOD_DETAIL_REQUEST,
  GET_FOOD_DETAIL_SUCCESS,
  GET_FOOD_DETAIL_FAILURE,
} from "../reducers/calendar";

// function openPopupAPI(data) {
//   // return axios.post("/api/diary/create", data);
//   console.log("openPopupData", data);
//   return data;
// }
function* openPopup(action) {
  try {
    // const result = yield call(openPopupAPI, action.data);
    yield put({
      type: OPEN_POPUP_SUCCESS,
      data: action.data,
    });
  } catch (err) {
    yield put({
      type: OPEN_POPUP_FAILURE,
      error: err.response.data,
    });
  }
}

function closePopupAPI(data) {
  // return axios.post("/api/diary/create", data);
  return data;
}

function* closePopup(action) {
  try {
    const result = yield call(closePopupAPI, action.data);
    yield put({
      type: CLOSE_POPUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CLOSE_POPUP_FAILURE,
      error: err.response.data,
    });
  }
}

function getFoodDetailAPI(data) {
  console.log("getFoodDetailAPI", data);
  return axios.get(`/api/food/load/${encodeURIComponent(data)}`);
}

function* getFoodDetail(action) {
  try {
    console.log("getFoodDetail", action.data);
    const result = yield call(getFoodDetailAPI, action.data);
    yield put({
      type: GET_FOOD_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: GET_FOOD_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchOpenPopup() {
  yield takeLatest(OPEN_POPUP_REQUEST, openPopup);
}

function* watchClosePopup() {
  yield takeLatest(CLOSE_POPUP_REQUEST, closePopup);
}

function* watchGetFoodDetail() {
  yield takeLatest(GET_FOOD_DETAIL_REQUEST, getFoodDetail);
}

export default function* calendarSaga() {
  yield all([
    fork(watchOpenPopup),
    fork(watchClosePopup),
    fork(watchGetFoodDetail),
  ]);
}
