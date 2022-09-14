import produce from "immer";

const initialState = {
  state: {
    loadDiaryLoading: false, // 다이어리 로딩 시도중
    loadDiaryDone: false,
    loadDiaryError: null,

    diaryCreateLoading: false, // 다이어리 쓰기 시도중
    diaryCreateDone: false,
    diaryCreateError: null,

    diaryRemoveLoading: false, // 다이어리 삭제 시도중
    diaryRemoveDone: false,
    diaryRemoveError: null,

    diaryUpdateLoading: false, //다이어리 수정 시도중
    diaryUpdateDone: false,
    diaryUpdateError: null,
  },
  diary: [],
};

/* 액션 타입 만들기 */
export const INIT = "INIT";

export const LOAD_DIARY_REQUEST = "LOAD_DIARY_REQUEST";
export const LOAD_DIARY_SUCCESS = "LOAD_DIARY_SUCCESS";
export const LOAD_DIARY_FAILURE = "LOAD_DIARY_FAILURE";

export const DIARY_CREATE_REQUEST = "DIARY_CREATE_REQUEST";
export const DIARY_CREATE_SUCCESS = "DIARY_CREATE_SUCCESS";
export const DIARY_CREATE_FAILURE = "DIARY_CREATE_FAILURE";

export const DIARY_REMOVE_REQUEST = "DIARY_REMOVE_REQUEST";
export const DIARY_REMOVE_SUCCESS = "DIARY_REMOVE_SUCCESS";
export const DIARY_REMOVE_FAILURE = "DIARY_REMOVE_FAILURE";

export const DIARY_UPDATE_REQUEST = "DIARY_UPDATE_REQUEST";
export const DIARY_UPDATE_SUCCESS = "DIARY_UPDATE_SUCCESS";
export const DIARY_UPDATE_FAILURE = "DIARY_UPDATE_FAILURE";

/* 리듀서 선언 */

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT:
        draft.diary = action.data;
        break;

      case DIARY_CREATE_REQUEST:
        draft.state.diaryCreateLoading = true;
        draft.state.diaryCreateDone = false;
        draft.state.diaryCreateError = null;
        break;
      case DIARY_CREATE_SUCCESS:
        draft.state.diaryCreateLoading = false;
        draft.state.diaryCreateDone = true;
        draft.state.diaryCreateError = null;
        draft.diary.unshift(action.data);
        break;
      case DIARY_CREATE_FAILURE:
        draft.state.diaryCreateError = action.error;
        break;

      case DIARY_REMOVE_REQUEST:
        draft.state.diaryRemoveLoading = true;
        draft.state.diaryRemoveDone = false;
        draft.state.diaryRemoveError = null;
        break;
      case DIARY_REMOVE_SUCCESS:
        draft.state.diaryRemoveLoading = false;
        draft.state.diaryRemoveDone = true;
        draft.state.diaryRemoveError = null;
        draft.diary = draft.diary.filter((e) => e.id !== parseInt(action.data));
        break;
      case DIARY_REMOVE_FAILURE:
        draft.state.diaryRemoveError = action.error;
        break;

      case DIARY_UPDATE_REQUEST:
        draft.state.diaryUpdateLoading = true;
        draft.state.diaryUpdateDone = false;
        draft.state.diaryUpdateError = null;
        break;
      case DIARY_UPDATE_SUCCESS:
        draft.state.diaryUpdateLoading = false;
        draft.state.diaryUpdateDone = true;
        draft.state.diaryUpdateError = null;
        draft.diary = draft.diary.map((e) =>
          e.id === action.data.id ? action.data : e
        );
        break;
      case DIARY_UPDATE_FAILURE:
        draft.state.diaryUpdateError = action.error;
        break;

      case LOAD_DIARY_REQUEST:
        draft.state.loadDiaryLoading = true;
        draft.state.loadDiaryDone = false;
        draft.state.loadDiaryError = null;
        break;
      case LOAD_DIARY_SUCCESS:
        draft.state.loadDiaryLoading = false;
        draft.state.loadDiaryDone = true;
        draft.state.loadDiaryError = null;
        draft.diary = action.data;
        break;
      case LOAD_DIARY_FAILURE:
        draft.state.loadDiaryError = action.error;
        break;

      default:
        return state;
    }
  });
};

export default reducer;
