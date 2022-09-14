import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import axios from "axios";
import {
  DIARY_CREATE_FAILURE,
  DIARY_CREATE_REQUEST,
  DIARY_CREATE_SUCCESS,
  DIARY_REMOVE_FAILURE,
  DIARY_REMOVE_REQUEST,
  DIARY_REMOVE_SUCCESS,
  DIARY_UPDATE_FAILURE,
  DIARY_UPDATE_REQUEST,
  DIARY_UPDATE_SUCCESS,
  LOAD_DIARY_FAILURE,
  LOAD_DIARY_REQUEST,
  LOAD_DIARY_SUCCESS,
} from "../reducers/diary";

function createDiaryAPI(data) {
  return axios.post("/api/diary/create", data);
}
function* createDiary(action) {
  try {
    const result = yield call(createDiaryAPI, action.data);
    yield put({
      type: DIARY_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: DIARY_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

function loadDiaryAPI(data) {
  return axios.get("/api/diary/load");
}

function* loadDiary(action) {
  try {
    const result = yield call(loadDiaryAPI, action.data);
    yield put({
      type: LOAD_DIARY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_DIARY_FAILURE,
      error: err.response.data,
    });
  }
}

function removeDiaryAPI(data) {
  return axios.delete(`/api/diary/remove/${data}`);
}

function* removeDiary(action) {
  try {
    const result = yield call(removeDiaryAPI, action.data);
    yield put({
      type: DIARY_REMOVE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: DIARY_REMOVE_FAILURE,
      error: err.response.data,
    });
  }
}

function updateDiaryAPI(data) {
  return axios.post(`api/diary/update/${data.diaryId}`, data);
}

function* updateDiary(action) {
  try {
    const result = yield call(updateDiaryAPI, action.data);
    yield put({
      type: DIARY_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: DIARY_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchCreateDiary() {
  yield takeLatest(DIARY_CREATE_REQUEST, createDiary);
}

function* watchLoadDiary() {
  yield takeLatest(LOAD_DIARY_REQUEST, loadDiary);
}

function* watchRemoveDiary() {
  yield takeLatest(DIARY_REMOVE_REQUEST, removeDiary);
}

function* watchUpdateDiary() {
  yield takeLatest(DIARY_UPDATE_REQUEST, updateDiary);
}

export default function* userSaga() {
  yield all([
    fork(watchCreateDiary),
    fork(watchLoadDiary),
    fork(watchRemoveDiary),
    fork(watchUpdateDiary),
  ]);
}
