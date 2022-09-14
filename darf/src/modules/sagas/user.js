import { all, fork, takeLatest, put, call, take } from "redux-saga/effects";
import axios from "axios";
import {
  KAKAO_LOGIN_FAILURE,
  KAKAO_LOGIN_REQUEST,
  KAKAO_LOGIN_SUCCESS,
  LOAD_ME_FAILURE,
  LOAD_ME_REQUEST,
  LOAD_ME_SUCCESS,
  USER_LOGIN_FAILURE,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_FAILURE,
  USER_LOGOUT_REQUEST,
  USER_LOGOUT_SUCCESS,
  USER_SIGNUP_FAILURE,
  USER_SIGNUP_REQUEST,
  USER_SIGNUP_SUCCESS,
  DIET_WRITE_FAILURE,
  DIET_WRITE_REQUEST,
  DIET_WRITE_SUCCESS,
  LOAD_DIET_REQUEST,
  LOAD_DIET_SUCCESS,
  LOAD_DIET_FAILURE,
  WIDTH_WRITE_REQUEST,
  WIDTH_WRITE_SUCCESS,
  WIDTH_WRITE_FAILURE,
  LOAD_WIDTH_SUCCESS,
  LOAD_WIDTH_FAILURE,
  LOAD_WIDTH_REQUEST,
  EXERCISE_WRITE_REQUEST,
  EXERCISE_WRITE_FAILURE,
  EXERCISE_WRITE_SUCCESS,
  LOAD_EXERCISE_REQUEST,
  LOAD_EXERCISE_SUCCESS,
  LOAD_EXERCISE_FAILURE,
  REMOVE_WIDTH_REQUEST,
  REMOVE_WIDTH_SUCCESS,
  UPLOAD_IMAGES_SUCCESS,
  UPLOAD_IMAGES_FAILURE,
  UPLOAD_IMAGES_REQUEST,
  REMOVE_DIET_REQUEST,
  REMOVE_DIET_SUCCESS,
  REMOVE_DIET_FAILURE,
  REMOVE_EXERCISE_REQUEST,
  REMOVE_EXERCISE_SUCCESS,
  REMOVE_EXERCISE_FAILURE,
  LOAD_CHALLENGE_REQUEST,
  LOAD_CHALLENGE_SUCCESS,
  LOAD_CHALLENGE_FAILURE,
  CHANGE_NICKNAME_REQUEST,
  CHANGE_NICKNAME_SUCCESS,
  CHANGE_NICKNAME_FAILURE,
  LOAD_CHART_INFO_REQUEST,
  LOAD_CHART_INFO_SUCCESS,
  LOAD_CHART_INFO_FAILURE,
  CHANGE_PROFILE_EMOJI_REQUEST,
  CHANGE_PROFILE_EMOJI_SUCCESS,
  CHANGE_PROFILE_EMOJI_FAILURE,
} from "../reducers/user";

function uploadImagesAPI(data) {
  return axios.post("/api/healthRecordRouter/images", data); // FormData의 경우 {} 이런식으로 감싸버리면 Json으로 전송되기 때문에 꼭 그대로 보낼 것
}

function* uploadImages(action) {
  try {
    const result = yield call(uploadImagesAPI, action.data); // PostForm.js의 imageFormData
    yield put({
      type: UPLOAD_IMAGES_SUCCESS,
      data: result.data, //
    });
  } catch (err) {
    yield put({
      type: UPLOAD_IMAGES_FAILURE,
      data: err.response.data,
    });
  }
}

function signUpAPI(data) {
  return axios.post("/api/user/signup", data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);

    yield put({
      type: USER_SIGNUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: USER_SIGNUP_FAILURE,
      error: err.response.data,
    });
  }
}

function LogInAPI(data) {
  return axios.post("/api/user/login", data);
}

function* logIn(action) {
  try {
    const result = yield call(LogInAPI, action.data);

    yield put({
      type: USER_LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: USER_LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

function kakaoLogInAPI(data) {
  return axios.get(`/api/user/kakaologin`);
}

function* kakaoLogIn(action) {
  try {
    const result = yield call(kakaoLogInAPI, action.data);

    yield put({
      type: KAKAO_LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: KAKAO_LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

function logOutAPI(data) {
  return axios.post(`/api/user/logout`);
}

function* logOut(action) {
  try {
    const result = yield call(logOutAPI, action.data);

    yield put({
      type: USER_LOGOUT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: USER_LOGOUT_FAILURE,
      error: err.response.data,
    });
  }
}

function loadMeAPI(data) {
  return axios.get(`/api/user/load`);
}

function* loadMe(action) {
  try {
    const result = yield call(loadMeAPI, action.data);
    yield put({
      type: LOAD_ME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_ME_FAILURE,
      error: err.response.data,
    });
  }
}

function loadDietAPI(data) {
  return axios.get(`/api/healthRecordRouter/load?healthType=${data || 0}`);
}

function* loadDiet(action) {
  try {
    const result = yield call(loadDietAPI, action.data);
    yield put({
      type: LOAD_DIET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_DIET_FAILURE,
      error: err.response.data,
    });
  }
}

function writeDietAPI(data) {
  return axios.post("/api/healthRecordRouter/create", data);
}

function* writeDiet(action) {
  try {
    const result = yield call(writeDietAPI, action.data);
    yield put({
      type: DIET_WRITE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: DIET_WRITE_FAILURE,
      error: err.response.data,
    });
  }
}
function removeDietAPI(data) {
  return axios.delete(`/api/healthRecordRouter/diet/remove/${data.dietId}`);
}

function* removeDiet(action) {
  try {
    const result = yield call(removeDietAPI, action.data);
    yield put({
      type: REMOVE_DIET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_DIET_FAILURE,
      error: err.response.data,
    });
  }
}

function loadWidthAPI(data) {
  return axios.get(`/api/healthRecordRouter/width/load`);
}

function* loadWidth(action) {
  try {
    const result = yield call(loadWidthAPI, action.data);
    yield put({
      type: LOAD_WIDTH_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_WIDTH_FAILURE,
      error: err.response.data,
    });
  }
}

function writeWidthAPI(data) {
  return axios.post("/api/healthRecordRouter/width/create", data);
}

function* writeWidth(action) {
  try {
    const result = yield call(writeWidthAPI, action.data);
    yield put({
      type: WIDTH_WRITE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: WIDTH_WRITE_FAILURE,
      error: err.response.data,
    });
  }
}

function loadExerciseAPI(data) {
  return axios.get(`/api/healthRecordRouter/exercise/load`);
}

function* loadExercise(action) {
  try {
    const result = yield call(loadExerciseAPI, action.data);
    yield put({
      type: LOAD_EXERCISE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_EXERCISE_FAILURE,
      error: err.response.data,
    });
  }
}

function writeExerciseAPI(data) {
  return axios.post("/api/healthRecordRouter/exercise/create", data);
}

function* writeExercise(action) {
  try {
    const result = yield call(writeExerciseAPI, action.data);
    yield put({
      type: EXERCISE_WRITE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: EXERCISE_WRITE_FAILURE,
      error: err.response.data,
    });
  }
}

function removeExerciseAPI(data) {
  return axios.delete(
    `/api/healthRecordRouter/exercise/remove/${data.exerciseId}`
  );
}

function* removeExercise(action) {
  try {
    const result = yield call(removeExerciseAPI, action.data);
    yield put({
      type: REMOVE_EXERCISE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_EXERCISE_FAILURE,
      error: err.response.data,
    });
  }
}

function removeWidthAPI(data) {
  return axios.delete(`/api/healthRecordRouter/width/remove/${data.WidthId}`);
}

function* removeWidth(action) {
  try {
    const result = yield call(removeWidthAPI, action.data);
    yield put({
      type: REMOVE_WIDTH_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_WIDTH_SUCCESS,
      error: err.response.data,
    });
  }
}

function loadChallengeAPI(data) {
  return axios.get(`/api/user/challenge/${data}`);
}

function* loadChallenge(action) {
  try {
    const result = yield call(loadChallengeAPI, action.data);
    yield put({
      type: LOAD_CHALLENGE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_CHALLENGE_FAILURE,
      error: err.response.data,
    });
  }
}

function changeNicknameAPI(data) {
  return axios.patch(`/api/user/nickname`, data);
}

function* changeNickname(action) {
  try {
    const result = yield call(changeNicknameAPI, action.data);
    yield put({
      type: CHANGE_NICKNAME_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_NICKNAME_FAILURE,
      error: err.response.data,
    });
  }
}
function loadChartInfoAPI(data) {
  return axios.get(`/api/healthRecordRouter/chart/${parseInt(data)} `);
}

function* loadChartInfo(action) {
  try {
    const result = yield call(loadChartInfoAPI, action.data);
    yield put({
      type: LOAD_CHART_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_CHART_INFO_FAILURE,
      error: err.response.data,
    });
  }
}
function changeProfileEmojiAPI(data) {
  return axios.patch(`/api/user/profile`, data);
}

function* changeProfileEmoji(action) {
  try {
    const result = yield call(changeProfileEmojiAPI, action.data);
    yield put({
      type: CHANGE_PROFILE_EMOJI_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CHANGE_PROFILE_EMOJI_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchSignUp() {
  yield takeLatest(USER_SIGNUP_REQUEST, signUp);
}

function* watchLogin() {
  yield takeLatest(USER_LOGIN_REQUEST, logIn);
}

function* watchKakaoLogin() {
  yield takeLatest(KAKAO_LOGIN_REQUEST, kakaoLogIn);
}

function* watchLogout() {
  yield takeLatest(USER_LOGOUT_REQUEST, logOut);
}
function* watchLoadMe() {
  yield takeLatest(LOAD_ME_REQUEST, loadMe);
}
function* watchLoadDiet() {
  yield takeLatest(LOAD_DIET_REQUEST, loadDiet);
}
function* watchWriteDiet() {
  yield takeLatest(DIET_WRITE_REQUEST, writeDiet);
}

function* watchRemoveDiet() {
  yield takeLatest(REMOVE_DIET_REQUEST, removeDiet);
}

function* watchLoadWidth() {
  yield takeLatest(LOAD_WIDTH_REQUEST, loadWidth);
}
function* watchWriteWidth() {
  yield takeLatest(WIDTH_WRITE_REQUEST, writeWidth);
}

function* watchLoadExercise() {
  yield takeLatest(LOAD_EXERCISE_REQUEST, loadExercise);
}

function* watchWriteExercise() {
  yield takeLatest(EXERCISE_WRITE_REQUEST, writeExercise);
}

function* watchRemoveExercise() {
  yield takeLatest(REMOVE_EXERCISE_REQUEST, removeExercise);
}

function* watchRemoveWidth() {
  yield takeLatest(REMOVE_WIDTH_REQUEST, removeWidth);
}

function* watchUploadImages() {
  yield takeLatest(UPLOAD_IMAGES_REQUEST, uploadImages);
}

function* watchLoadChallenge() {
  yield takeLatest(LOAD_CHALLENGE_REQUEST, loadChallenge);
}

function* watchChangeNickname() {
  yield takeLatest(CHANGE_NICKNAME_REQUEST, changeNickname);
}
function* watchLoadChartInfo() {
  yield takeLatest(LOAD_CHART_INFO_REQUEST, loadChartInfo);
}
function* watchChangeProfileEmoji() {
  yield takeLatest(CHANGE_PROFILE_EMOJI_REQUEST, changeProfileEmoji);
}

export default function* userSaga() {
  yield all([
    fork(watchSignUp),
    fork(watchLogin),
    fork(watchKakaoLogin),
    fork(watchLogout),
    fork(watchLoadMe),
    fork(watchLoadWidth),
    fork(watchWriteWidth),
    fork(watchLoadDiet),
    fork(watchWriteDiet),
    fork(watchRemoveDiet),
    fork(watchWriteExercise),
    fork(watchRemoveExercise),
    fork(watchLoadExercise),
    fork(watchRemoveWidth),
    fork(watchUploadImages),
    fork(watchLoadChallenge),
    fork(watchChangeNickname),
    fork(watchLoadChartInfo),
    fork(watchChangeProfileEmoji),
  ]);
}
