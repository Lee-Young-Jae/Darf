import { all, fork, takeLatest, put, call } from "redux-saga/effects";
import axios from "axios";
import {
  CHANGE_GROUP_ADMIN_REQUEST,
  CREATE_COMMENT_FAILURE,
  CREATE_COMMENT_REQUEST,
  CREATE_COMMENT_SUCCESS,
  CREATE_GROUP_POST_FAILURE,
  CREATE_GROUP_POST_REQUEST,
  CREATE_GROUP_POST_SUCCESS,
  DROP_USER_FAILURE,
  DROP_USER_REQUEST,
  DROP_USER_SUCCESS,
  EDIT_GROUP_FAILURE,
  EDIT_GROUP_REQUEST,
  EDIT_GROUP_SUCCESS,
  GROUP_CREATE_FAILURE,
  GROUP_CREATE_REQUEST,
  GROUP_CREATE_SUCCESS,
  JOIN_GROUP_FAILURE,
  JOIN_GROUP_REQUEST,
  JOIN_GROUP_SUCCESS,
  LEAVE_GROUP_FAILURE,
  LEAVE_GROUP_REQUEST,
  LEAVE_GROUP_SUCCESS,
  LIKE_POST_FAILURE,
  LIKE_POST_REQUEST,
  LIKE_POST_SUCCESS,
  LOAD_GROUP_POSTS_FAILURE,
  LOAD_GROUP_POSTS_REQUEST,
  LOAD_GROUP_POSTS_SUCCESS,
  LOAD_GROUP_USERPOST_FAILURE,
  LOAD_GROUP_USERPOST_REQUEST,
  LOAD_GROUP_USERPOST_SUCCESS,
  LOAD_REGISTED_GROUP_FAILURE,
  LOAD_REGISTED_GROUP_REQUEST,
  LOAD_REGISTED_GROUP_SUCCESS,
  LOAD_SELECTED_GROUP_FAILURE,
  LOAD_SELECTED_GROUP_REQUEST,
  LOAD_SELECTED_GROUP_SUCCESS,
  REMOVE_COMMENT_FAILURE,
  REMOVE_COMMENT_REQUEST,
  REMOVE_COMMENT_SUCCESS,
  REMOVE_GROUP_FAILURE,
  REMOVE_GROUP_POST_FAILURE,
  REMOVE_GROUP_POST_REQUEST,
  REMOVE_GROUP_POST_SUCCESS,
  REMOVE_GROUP_REQUEST,
  REMOVE_GROUP_SUCCESS,
  SEARCH_GROUP_FAILURE,
  SEARCH_GROUP_REQUEST,
  SEARCH_GROUP_SUCCESS,
} from "../reducers/group";

function loadRegistedGroupAPI(data) {
  return axios.get("/api/group/load", data);
}
function* loadRegistedGroup(action) {
  try {
    const result = yield call(loadRegistedGroupAPI, action.data);
    yield put({
      type: LOAD_REGISTED_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_REGISTED_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}

function createGroupAPI(data) {
  return axios.post("/api/group/create", data);
}
function* createGroup(action) {
  try {
    const result = yield call(createGroupAPI, action.data);
    yield put({
      type: GROUP_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: GROUP_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

function searchGroupAPI(data) {
  return axios.get(
    `/api/group/search?name=${
      encodeURIComponent(data.name) ||
      encodeURIComponent("아무것도 입력되지 않음")
    }&purpose=${
      encodeURIComponent(data.purpose) ||
      encodeURIComponent("아무것도 입력되지 않음")
    }`
  ); //&로 구분을 하고 key=value&key=value... get은 쿼리스트링 하는 방식으로 데이터를 전송
}
function* searchGroup(action) {
  try {
    const result = yield call(searchGroupAPI, action.data);
    yield put({
      type: SEARCH_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: SEARCH_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}

function joinGroupAPI(data) {
  return axios.post(`/api/group/join`, data);
}
function* joinGroup(action) {
  try {
    const result = yield call(joinGroupAPI, action.data);
    yield put({
      type: JOIN_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: JOIN_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}

function createGroupPostAPI(data) {
  return axios.post("/api/group/post/create", data);
}
function* createGroupPost(action) {
  try {
    const result = yield call(createGroupPostAPI, action.data);
    yield put({
      type: CREATE_GROUP_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CREATE_GROUP_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function removeGroupPostAPI(data) {
  return axios.delete(`/api/group/post/${data}`);
}
function* removeGroupPost(action) {
  try {
    const result = yield call(removeGroupPostAPI, action.data);
    yield put({
      type: REMOVE_GROUP_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_GROUP_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function loadSelectedGroupAPI(data) {
  return axios.get(`/api/group/selected/load?groupId=${data.groupId || 0}`);
}
function* loadSelectedGroup(action) {
  try {
    const result = yield call(loadSelectedGroupAPI, action.data);
    yield put({
      type: LOAD_SELECTED_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_SELECTED_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}

function likePostAPI(data) {
  return axios.patch(`/api/group/like`, data);
}
function* likePost(action) {
  try {
    const result = yield call(likePostAPI, action.data);
    console.log("likePost result.data", result.data);
    yield put({
      type: LIKE_POST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LIKE_POST_FAILURE,
      error: err.response.data,
    });
  }
}

function createCommentAPI(data) {
  return axios.post("/api/group/comment/create", data);
}
function* createComment(action) {
  try {
    const result = yield call(createCommentAPI, action.data);
    yield put({
      type: CREATE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: CREATE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function removeCommentAPI(data) {
  return axios.delete(`/api/group/comment/${data.commentId}/${data.postId}`);
}
function* removeComment(action) {
  try {
    const result = yield call(removeCommentAPI, action.data);
    yield put({
      type: REMOVE_COMMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_COMMENT_FAILURE,
      error: err.response.data,
    });
  }
}

function loadGroupUserPostAPI(data) {
  return axios.get(
    `/api/group/selected/${data.groupId}/load?userId=${data.userId || 0}`
  );
}
function* loadGroupUserPost(action) {
  try {
    const result = yield call(loadGroupUserPostAPI, action.data);
    yield put({
      type: LOAD_GROUP_USERPOST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_GROUP_USERPOST_FAILURE,
      error: err.response.data,
    });
  }
}

function leaveGroupAPI(data) {
  return axios.delete(`/api/group/leave/${data.groupId}`);
}
function* leaveGroup(action) {
  try {
    const result = yield call(leaveGroupAPI, action.data);
    yield put({
      type: LEAVE_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LEAVE_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}

function editGroupAPI(data) {
  return axios.put(`/api/group/edit/${data.groupId}`, data);
}
function* editGroup(action) {
  try {
    const result = yield call(editGroupAPI, action.data);
    yield put({
      type: EDIT_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: EDIT_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}
function dropUserAPI(data) {
  return axios.delete(`/api/group/drop/${data.userId}/${data.groupId}`);
}
function* dropUser(action) {
  try {
    const result = yield call(dropUserAPI, action.data);
    yield put({
      type: DROP_USER_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: DROP_USER_FAILURE,
      error: err.response.data,
    });
  }
}

function removeGroupAPI(data) {
  return axios.delete(`/api/group/${data.groupId}`);
}
function* removeGroup(action) {
  try {
    const result = yield call(removeGroupAPI, action.data);
    yield put({
      type: REMOVE_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}
function changeGroupAdminAPI(data) {
  return axios.patch(`/api/group/admin/${data.groupId}/${data.userId}`);
}
function* changeGroupAdmin(action) {
  try {
    const result = yield call(changeGroupAdminAPI, action.data);
    yield put({
      type: REMOVE_GROUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: REMOVE_GROUP_FAILURE,
      error: err.response.data,
    });
  }
}
function loadGroupPostsAPI(data) {
  return axios.get(
    `/api/group/selected/grouppost/load/${data.groupId}/${
      data.lastId === undefined ? 0 : data.lastId
    }/`
  );
}
function* loadGroupPosts(action) {
  try {
    const result = yield call(loadGroupPostsAPI, action.data);
    yield put({
      type: LOAD_GROUP_POSTS_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    yield put({
      type: LOAD_GROUP_POSTS_FAILURE,
      error: err.response.data,
    });
  }
}

function* watchLoadRegistedGroup() {
  yield takeLatest(LOAD_REGISTED_GROUP_REQUEST, loadRegistedGroup);
}

function* watchCreateGroup() {
  yield takeLatest(GROUP_CREATE_REQUEST, createGroup);
}
function* watchSearchGroup() {
  yield takeLatest(SEARCH_GROUP_REQUEST, searchGroup);
}
function* watchJoinGroup() {
  yield takeLatest(JOIN_GROUP_REQUEST, joinGroup);
}
function* watchCreateGroupPost() {
  yield takeLatest(CREATE_GROUP_POST_REQUEST, createGroupPost);
}

function* watchRemoveGroupPost() {
  yield takeLatest(REMOVE_GROUP_POST_REQUEST, removeGroupPost);
}

function* watchLoadSelectedGroup() {
  yield takeLatest(LOAD_SELECTED_GROUP_REQUEST, loadSelectedGroup);
}

function* watchLikePost() {
  yield takeLatest(LIKE_POST_REQUEST, likePost);
}

function* watchCreateComment() {
  yield takeLatest(CREATE_COMMENT_REQUEST, createComment);
}
function* watchRemoveComment() {
  yield takeLatest(REMOVE_COMMENT_REQUEST, removeComment);
}

function* watchLoadGroupUserPost() {
  yield takeLatest(LOAD_GROUP_USERPOST_REQUEST, loadGroupUserPost);
}

function* watchLeaveGroup() {
  yield takeLatest(LEAVE_GROUP_REQUEST, leaveGroup);
}
function* watchEditGroup() {
  yield takeLatest(EDIT_GROUP_REQUEST, editGroup);
}
function* watchDropUser() {
  yield takeLatest(DROP_USER_REQUEST, dropUser);
}
function* watchRemoveGroup() {
  yield takeLatest(REMOVE_GROUP_REQUEST, removeGroup);
}
function* watchChageGroupAdmin() {
  yield takeLatest(CHANGE_GROUP_ADMIN_REQUEST, changeGroupAdmin);
}
function* watchLoadGroupPosts() {
  yield takeLatest(LOAD_GROUP_POSTS_REQUEST, loadGroupPosts);
}

export default function* userSaga() {
  yield all([
    fork(watchCreateGroup),
    fork(watchLoadRegistedGroup),
    fork(watchSearchGroup),
    fork(watchJoinGroup),
    fork(watchCreateGroupPost),
    fork(watchRemoveGroupPost),
    fork(watchLoadSelectedGroup),
    fork(watchLikePost),
    fork(watchCreateComment),
    fork(watchRemoveComment),
    fork(watchLoadGroupUserPost),
    fork(watchLeaveGroup),
    fork(watchEditGroup),
    fork(watchDropUser),
    fork(watchRemoveGroup),
    fork(watchChageGroupAdmin),
    fork(watchLoadGroupPosts),
  ]);
}
