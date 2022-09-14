import produce from "immer";

const initialState = {
  state: {
    openDetailPopupLoading: false, // 팝업창 열기 시도중
    openDetailPopupDone: false,
    openDetailPopupError: null,

    closeDetailPopupLoading: false, // 팝업창 닫기 시도중
    closeDetailPopupDone: false,
    closeDetailPopupError: null,

    getFoodDetailLoading: false, // 음식 정보 검색 시도중
    getFoodDetailDone: false,
    getFoodDetailError: null,
  },
  calendar: {
    choiceDate: new Date(),
    food: {
      searchFoodDetail: [{ id: 1, name: "김치국", kcal: 89 }],
      boardData: {
        id: 1,
        foodName: "찹살떡",
        foodImagePaths: ["1.jpg"],
        kcal: 330,
      },
    },
  },
};

/* 액션 타입 만들기 */
export const INIT = "INIT";

export const OPEN_POPUP_REQUEST = "OPEN_POPUP_REQUEST";
export const OPEN_POPUP_SUCCESS = "OPEN_POPUP_SUCCESS";
export const OPEN_POPUP_FAILURE = "OPEN_POPUP_FAILURE";

export const CLOSE_POPUP_REQUEST = "CLOSE_POPUP_REQUEST";
export const CLOSE_POPUP_SUCCESS = "CLOSE_POPUP_SUCCESS";
export const CLOSE_POPUP_FAILURE = "CLOSE_POPUP_FAILURE";

export const GET_FOOD_DETAIL_REQUEST = "GET_FOOD_DETAIL_REQUEST";
export const GET_FOOD_DETAIL_SUCCESS = "GET_FOOD_DETAIL_SUCCESS";
export const GET_FOOD_DETAIL_FAILURE = "GET_FOOD_DETAIL_FAILURE";

export const DIARY_CREATE_REQUEST = "DIARY_CREATE_REQUEST";
export const DIARY_CREATE_SUCCESS = "DIARY_CREATE_SUCCESS";
export const DIARY_CREATE_FAILURE = "DIARY_CREATE_FAILURE";

export const DIARY_REMOVE_REQUEST = "DIARY_REMOVE_REQUEST";
export const DIARY_REMOVE_SUCCESS = "DIARY_REMOVE_SUCCESS";
export const DIARY_REMOVE_FAILURE = "DIARY_REMOVE_FAILURE";

export const DIARY_UPDATE_REQUEST = "DIARY_UPDATE_REQUEST";
export const DIARY_UPDATE_SUCCESS = "DIARY_UPDATE_SUCCESS";
export const DIARY_UPDATE_FAILURE = "DIARY_UPDATE_FAILURE";

export const CHANGE_SELECT_DATE_REQUEST = "CHANGE_SELECT_DATE_REQUEST";
export const CHANGE_SELECT_DATE_SUCCESS = "CHANGE_SELECT_DATE_SUCCESS";
export const CHANGE_SELECT_DATE_FAILURE = "CHANGE_SELECT_DATE_FAILURE";

/* 리듀서 선언 */

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT:
        draft.calendar = action.data;
        break;
      case OPEN_POPUP_REQUEST:
        draft.state.openDetailPopupLoading = true;
        draft.state.openDetailPopupDone = false;
        draft.state.openDetailPopupError = null;
        break;
      case OPEN_POPUP_SUCCESS:
        draft.state.openDetailPopupLoading = false;
        draft.state.openDetailPopupDone = true;
        draft.state.openDetailPopupError = null;
        draft.calendar.choiceDate = action.data;
        break;
      case OPEN_POPUP_FAILURE:
        draft.state.openDetailPopupError = action.error;
        break;
      case CLOSE_POPUP_REQUEST:
        draft.state.closeDetailPopupLoading = true;
        draft.state.closeDetailPopupDone = false;
        draft.state.closeDetailPopupError = null;
        break;
      case CLOSE_POPUP_SUCCESS:
        draft.state.closeDetailPopupLoading = false;
        draft.state.closeDetailPopupDone = true;
        draft.state.closeDetailPopupError = null;
        draft.state.openDetailPopupDone = false;
        draft.calendar.choiceDate = {};
        break;
      case CLOSE_POPUP_FAILURE:
        draft.state.closeDetailPopupError = action.error;
        break;

      case GET_FOOD_DETAIL_REQUEST:
        draft.state.closeDetailPopupLoading = true;
        draft.state.closeDetailPopupDone = false;
        draft.state.closeDetailPopupError = null;
        break;
      case GET_FOOD_DETAIL_SUCCESS:
        draft.state.closeDetailPopupLoading = false;
        draft.state.closeDetailPopupDone = true;
        draft.state.closeDetailPopupError = null;
        draft.calendar.food.searchFoodDetail = action.data;
        break;
      case GET_FOOD_DETAIL_FAILURE:
        draft.state.closeDetailPopupError = action.error;
        break;

      case CHANGE_SELECT_DATE_REQUEST:
        draft.calendar.choiceDate = action.data;

        break;

      default:
        return state;
    }
  });
};

export default reducer;
