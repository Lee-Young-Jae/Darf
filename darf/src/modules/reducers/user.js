import produce from "immer";

const initialState = {
  state: {
    kakaoLoginLoading: false, // 카카오 로그인 시도중
    kakaoLoginDone: false,
    kakaoLoginError: null,
    signUpLoading: false, // 회원가입 시도중
    signUpDone: false,
    signUpError: null,

    logInLoading: false, // 로그인 시도중
    logInDone: false,
    logInError: null,
    logOutLoading: false, // 회원가입 시도중
    logOutDone: false,
    logOutError: null,

    loadMeLoading: false, // 내정보 불러오기 시도중
    loadMeDone: false,
    loadMeError: null,

    loadWidthLoading: false, //나의 체중 불러오기 시도중
    loadWidthDone: false,
    loadWidthError: null,

    widthWriteLoading: false, //체중 쓰기 시도중
    widthWriteDone: false,
    widthWriteError: null,

    removeWidthLoading: false, // 체중 지우기 시도중
    removeWidthDone: false,
    removeWidthError: null,

    loadDietListLoading: false, //기존 식단 리스트 불러오기 시도중
    loadDietListDone: false,
    loadDietListError: null,

    DietWriteLoading: false, // 식단 쓰기 시도중
    DietWriteDone: false,
    DietWriteError: null,

    removeDietLoading: false, // 식단 기록 삭제 시도중
    removeDietDone: false,
    removeDietError: null,

    loadExerciseLoading: false, // 운동기록 불러오기 시도중
    loadExerciseDone: false,
    loadExerciseError: null,

    ExerciseWriteLoading: false, // 운동기록 쓰기 시도중
    ExerciseWriteDone: false,
    ExerciseWriteError: null,

    removeExerciseLoading: false, // 식단 기록 삭제 시도중
    removeExerciseDone: false,
    removeExerciseError: null,

    uploadImageLoading: false, //이미지 업로드 시도중
    uploadImageDone: false,
    uploadImageError: null,

    loadChallengeListLoading: false, //도전과제 로드중
    loadChallengeListDone: false,
    loadChallengeListError: null,

    changeNicknameLoading: false, // 닉네임 변경 시도중
    changeNicknameDone: false,
    changeNicknameError: null,

    loadChartInfoLoading: false, // 차트 정보 로드 시도중
    loadChartInfoDone: false,
    loadChartInfoError: null,

    changeProfileEmojiLoading: false, //프로필 이모지 변경 시도중
    changeProfileEmojiDone: false,
    changeProfileEmojiError: null,
  },
  me: {
    diet: [],
    width: [],
    exercise: [],
    challenge: [],
    chart: [],
  },
  imagePaths: [],
};

/* 액션 타입 만들기 */
export const INIT = "INIT";

export const KAKAO_LOGIN_REQUEST = "KAKAO_LOGIN_REQUEST";
export const KAKAO_LOGIN_SUCCESS = "KAKAO_LOGIN_SUCCESS";
export const KAKAO_LOGIN_FAILURE = "KAKAO_LOGIN_FAILURE";

export const USER_SIGNUP_REQUEST = "USER_SIGNUP_REQUEST";
export const USER_SIGNUP_SUCCESS = "USER_SIGNUP_SUCCESS";
export const USER_SIGNUP_FAILURE = "USER_SIGNUP_FAILURE";

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAILURE = "USER_LOGIN_FAILURE";

export const USER_LOGOUT_REQUEST = "USER_LOGOUT_REQUEST";
export const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
export const USER_LOGOUT_FAILURE = "USER_LOGOUT_FAILURE";

export const DIARY_REMOVE_REQUEST = "DIARY_REMOVE_REQUEST";
export const DIARY_REMOVE_SUCCESS = "DIARY_REMOVE_SUCCESS";
export const DIARY_REMOVE_FAILURE = "DIARY_REMOVE_FAILURE";

export const DIARY_UPDATE_REQUEST = "DIARY_UPDATE_REQUEST";
export const DIARY_UPDATE_SUCCESS = "DIARY_UPDATE_SUCCESS";
export const DIARY_UPDATE_FAILURE = "DIARY_UPDATE_FAILURE";

export const LOAD_ME_REQUEST = "LOAD_ME_REQUEST";
export const LOAD_ME_SUCCESS = "LOAD_ME_SUCCESS";
export const LOAD_ME_FAILURE = "LOAD_ME_FAILURE";

export const LOAD_DIET_REQUEST = "LOAD_DIET_REQUEST";
export const LOAD_DIET_SUCCESS = "LOAD_DIET_SUCCESS";
export const LOAD_DIET_FAILURE = "LOAD_DIET_FAILURE";

export const DIET_WRITE_REQUEST = "DIET_WRITE_REQUEST";
export const DIET_WRITE_SUCCESS = "DIET_WRITE_SUCCESS";
export const DIET_WRITE_FAILURE = "DIET_WRITE_FAILURE";

export const REMOVE_DIET_REQUEST = "REMOVE_DIET_REQUEST";
export const REMOVE_DIET_SUCCESS = "REMOVE_DIET_SUCCESS";
export const REMOVE_DIET_FAILURE = "REMOVE_DIET_FAILURE";

export const LOAD_WIDTH_REQUEST = "LOAD_WIDTH_REQUEST";
export const LOAD_WIDTH_SUCCESS = "LOAD_WIDTH_SUCCESS";
export const LOAD_WIDTH_FAILURE = "LOAD_WIDTH_FAILURE";

export const WIDTH_WRITE_REQUEST = "WIDTH_WRITE_REQUEST";
export const WIDTH_WRITE_SUCCESS = "WIDTH_WRITE_SUCCESS";
export const WIDTH_WRITE_FAILURE = "WIDTH_WRITE_FAILURE";

export const REMOVE_WIDTH_REQUEST = "REMOVE_WIDTH_REQUEST";
export const REMOVE_WIDTH_SUCCESS = "REMOVE_WIDTH_SUCCESS";
export const REMOVE_WIDTH_FAILURE = "REMOVE_WIDTH_FAILURE";

export const LOAD_EXERCISE_REQUEST = "LOAD_EXERCISE_REQUEST";
export const LOAD_EXERCISE_SUCCESS = "LOAD_EXERCISE_SUCCESS";
export const LOAD_EXERCISE_FAILURE = "LOAD_EXERCISE_FAILURE";

export const EXERCISE_WRITE_REQUEST = "EXERCISE_WRITE_REQUEST";
export const EXERCISE_WRITE_SUCCESS = "EXERCISE_WRITE_SUCCESS";
export const EXERCISE_WRITE_FAILURE = "EXERCISE_WRITE_FAILURE";

export const REMOVE_EXERCISE_REQUEST = "REMOVE_EXERCISE_REQUEST";
export const REMOVE_EXERCISE_SUCCESS = "REMOVE_EXERCISE_SUCCESS";
export const REMOVE_EXERCISE_FAILURE = "REMOVE_EXERCISE_FAILURE";

export const UPLOAD_IMAGES_REQUEST = "UPLOAD_IMAGES_REQUEST";
export const UPLOAD_IMAGES_SUCCESS = "UPLOAD_IMAGES_SUCCESS";
export const UPLOAD_IMAGES_FAILURE = "UPLOAD_IMAGES_FAILURE";

export const LOAD_CHALLENGE_REQUEST = "LOAD_CHALLENGE_REQUEST";
export const LOAD_CHALLENGE_SUCCESS = "LOAD_CHALLENGE_SUCCESS";
export const LOAD_CHALLENGE_FAILURE = "LOAD_CHALLENGE_FAILURE";

export const CHANGE_NICKNAME_REQUEST = "CHANGE_NICKNAME_REQUEST";
export const CHANGE_NICKNAME_SUCCESS = "CHANGE_NICKNAME_SUCCESS";
export const CHANGE_NICKNAME_FAILURE = "CHANGE_NICKNAME_FAILURE";

export const LOAD_CHART_INFO_REQUEST = "LOAD_CHART_INFO_REQUEST";
export const LOAD_CHART_INFO_SUCCESS = "LOAD_CHART_INFO_SUCCESS";
export const LOAD_CHART_INFO_FAILURE = "LOAD_CHART_INFO_FAILURE";

export const CHANGE_PROFILE_EMOJI_REQUEST = "CHANGE_PROFILE_EMOJI_REQUEST";
export const CHANGE_PROFILE_EMOJI_SUCCESS = "CHANGE_PROFILE_EMOJI_SUCCESS";
export const CHANGE_PROFILE_EMOJI_FAILURE = "CHANGE_PROFILE_EMOJI_FAILURE";

/* 리듀서 선언 */

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT:
        draft.user = action.data;
        break;
      case KAKAO_LOGIN_REQUEST:
        draft.state.kakaoLoginLoading = true;
        draft.state.kakaoLoginDone = false;
        draft.state.kakaoLoginError = null;
        break;
      case KAKAO_LOGIN_SUCCESS:
        draft.state.kakaoLoginLoading = false;
        draft.state.kakaoLoginDone = true;
        draft.state.kakaoLoginError = null;
        draft.me = action.data;
        break;
      case KAKAO_LOGIN_FAILURE:
        draft.state.kakaoLoginError = action.error;
        break;
      case USER_SIGNUP_REQUEST:
        draft.state.signUpLoading = true;
        draft.state.signUpDone = false;
        draft.state.signUpError = null;
        break;
      case USER_SIGNUP_SUCCESS:
        draft.state.signUpLoading = false;
        draft.state.signUpDone = true;
        draft.state.signUpError = null;
        // draft.me = action.data;
        break;
      case USER_SIGNUP_FAILURE:
        draft.state.signUpError = action.error;
        break;
      case USER_LOGIN_REQUEST:
        draft.state.logInLoading = true;
        draft.state.logInDone = false;
        draft.state.logInError = null;
        break;
      case USER_LOGIN_SUCCESS:
        draft.state.logInLoading = false;
        draft.state.logInDone = true;
        draft.state.logInError = null;
        draft.me = action.data;
        break;
      case USER_LOGIN_FAILURE:
        draft.state.logInError = action.error;
        break;

      case USER_LOGOUT_REQUEST:
        draft.state.logOutLoading = true;
        draft.state.logOutDone = false;
        draft.state.logOutError = null;
        break;
      case USER_LOGOUT_SUCCESS:
        draft.state.logOutLoading = false;
        draft.state.logOutDone = true;
        draft.state.logOutError = null;
        draft.me = {};
        break;
      case USER_LOGOUT_FAILURE:
        draft.state.logOutError = action.error;
        break;

      case LOAD_ME_REQUEST:
        draft.state.loadMeLoading = true;
        draft.state.loadMeDone = false;
        draft.state.loadMeError = null;
        draft.state.loadChartInfoDone = false; //LoadChartInfo 초기화 (새로고침시 오류)
        draft.state.signUpDone = false; //signUp 초기화
        draft.state.logOutDone = false; // 로그아웃 Done 초기화
        break;
      case LOAD_ME_SUCCESS:
        draft.state.loadMeLoading = false;
        draft.state.loadMeDone = true;
        draft.state.loadMeError = null;
        draft.me = action.data;
        break;
      case LOAD_ME_FAILURE:
        draft.state.loadMeError = action.error;
        break;

      case LOAD_WIDTH_REQUEST:
        draft.state.loadWidthLoading = true;
        draft.state.loadWidthDone = false;
        draft.state.loadWidthError = null;
        break;
      case LOAD_WIDTH_SUCCESS:
        draft.state.loadWidthLoading = false;
        draft.state.loadWidthDone = true;
        draft.state.loadWidthError = null;
        draft.me.width = action.data;
        break;
      case LOAD_WIDTH_FAILURE:
        draft.state.loadDietListError = action.error;
        break;

      case WIDTH_WRITE_REQUEST:
        draft.state.widthWriteLoading = true;
        draft.state.widthWriteDone = false;
        draft.state.widthWriteError = null;
        break;
      case WIDTH_WRITE_SUCCESS:
        draft.state.widthWriteLoading = false;
        draft.state.widthWriteDone = true;
        draft.state.widthWriteError = null;
        draft.me.width.unshift(action.data);
        break;
      case WIDTH_WRITE_FAILURE:
        draft.state.widthWriteError = action.error;
        break;

      case REMOVE_WIDTH_REQUEST:
        draft.state.removeWidthLoading = true;
        draft.state.removeWidthDone = false;
        draft.state.removeWidthError = null;
        break;
      case REMOVE_WIDTH_SUCCESS:
        draft.state.removeWidthLoading = false;
        draft.state.removeWidthDone = true;
        draft.state.removeWidthError = null;
        draft.me.width = draft.me.width.filter((width) => {
          return width.id !== parseInt(action.data.id);
        });
        break;
      case REMOVE_WIDTH_FAILURE:
        draft.state.removeWidthError = action.error;
        break;

      case LOAD_DIET_REQUEST:
        draft.state.loadDietListLoading = true;
        draft.state.loadDietListDone = false;
        draft.state.loadDietListError = null;
        break;
      case LOAD_DIET_SUCCESS:
        draft.state.loadDietListLoading = false;
        draft.state.loadDietListDone = true;
        draft.state.loadDietListError = null;
        draft.me.diet = action.data;
        break;
      case LOAD_DIET_FAILURE:
        draft.state.loadDietListError = action.error;
        break;

      case DIET_WRITE_REQUEST:
        draft.state.loadDietListLoading = true;
        draft.state.loadDietListDone = false;
        draft.state.loadDietListError = null;
        break;
      case DIET_WRITE_SUCCESS:
        draft.state.loadDietListLoading = false;
        draft.state.loadDietListDone = true;
        draft.state.loadDietListError = null;
        draft.me.diet.unshift(action.data);
        draft.imagePaths = [];
        break;
      case DIET_WRITE_FAILURE:
        draft.state.loadDietListError = action.error;
        break;

      case REMOVE_DIET_REQUEST:
        draft.state.removeDietLoading = true;
        draft.state.removeDietDone = false;
        draft.state.removeDietError = null;
        break;
      case REMOVE_DIET_SUCCESS:
        draft.state.removeDietLoading = false;
        draft.state.removeDietDone = true;
        draft.state.removeDietError = null;
        draft.me.diet = draft.me.diet.filter((diet) => {
          return diet.id !== parseInt(action.data);
        });
        break;
      case REMOVE_DIET_FAILURE:
        draft.state.removeDietError = action.error;
        break;

      case LOAD_EXERCISE_REQUEST:
        draft.state.loadExerciseLoading = true;
        draft.state.loadExerciseDone = false;
        draft.state.loadExerciseError = null;
        draft.state.ExerciseWriteDone = false;
        break;
      case LOAD_EXERCISE_SUCCESS:
        draft.state.loadExerciseLoading = false;
        draft.state.loadExerciseDone = true;
        draft.state.loadExerciseError = null;
        draft.me.exercise = action.data;

        break;
      case LOAD_EXERCISE_FAILURE:
        draft.state.loadExerciseError = action.error;
        break;

      case EXERCISE_WRITE_REQUEST:
        draft.state.ExerciseWriteLoading = true;
        draft.state.ExerciseWriteDone = false;
        draft.state.ExerciseWriteError = null;
        break;
      case EXERCISE_WRITE_SUCCESS:
        draft.state.ExerciseWriteLoading = false;
        draft.state.ExerciseWriteDone = true;
        draft.state.ExerciseWriteError = null;
        draft.me.exercise.unshift(action.data);
        break;
      case EXERCISE_WRITE_FAILURE:
        draft.state.ExerciseWriteError = action.error;
        break;

      case REMOVE_EXERCISE_REQUEST:
        draft.state.removeExerciseLoading = true;
        draft.state.removeExerciseDone = false;
        draft.state.removeExerciseError = null;
        break;
      case REMOVE_EXERCISE_SUCCESS:
        draft.state.removeExerciseLoading = false;
        draft.state.removeExerciseDone = true;
        draft.state.removeExerciseError = null;
        draft.me.exercise = draft.me.exercise.filter((exercise) => {
          return exercise.id !== parseInt(action.data);
        });
        break;
      case REMOVE_EXERCISE_FAILURE:
        draft.state.removeDietError = action.error;
        break;

      case UPLOAD_IMAGES_REQUEST:
        draft.uploadImagesLoading = true;
        draft.uploadImagesDone = false;
        draft.uploadImagesError = null;
        break;
      case UPLOAD_IMAGES_SUCCESS: {
        draft.uploadImagesLoading = false;
        draft.uploadImagesDone = true;
        draft.imagePaths = draft.imagePaths.concat(action.data);
        break;
      }
      case UPLOAD_IMAGES_FAILURE:
        draft.uploadImagesLoading = false;
        draft.uploadImagesError = action.error;
        break;

      case LOAD_CHALLENGE_REQUEST:
        draft.loadChallengeListLoading = true;
        draft.loadChallengeListDone = false;
        draft.loadChallengeListError = null;
        draft.changeNicknameError = null; // 닉네임 에러도 초기화
        break;
      case LOAD_CHALLENGE_SUCCESS: {
        draft.loadChallengeListLoading = false;
        draft.loadChallengeListDone = true;
        draft.loadChallengeListError = null;
        draft.me.challenge = action.data;
        break;
      }
      case LOAD_CHALLENGE_FAILURE:
        draft.loadChallengeListLoading = false;
        draft.loadChallengeListError = action.error;
        break;

      case CHANGE_NICKNAME_REQUEST:
        draft.state.changeNicknameLoading = true;
        draft.state.changeNicknameDone = false;
        draft.state.changeNicknameError = null;
        break;
      case CHANGE_NICKNAME_SUCCESS:
        draft.state.changeNicknameLoading = false;
        draft.state.changeNicknameDone = true;
        draft.state.changeNicknameError = null;
        draft.me.nickname = action.data;
        break;
      case CHANGE_NICKNAME_FAILURE:
        draft.state.changeNicknameError = action.error;
        break;

      case LOAD_CHART_INFO_REQUEST:
        draft.state.loadChartInfoLoading = true;
        draft.state.loadChartInfoDone = false;
        draft.state.loadChartInfoError = null;
        draft.state.changeNicknameError = null; //닉네임 변경 오류도 초기화
        break;
      case LOAD_CHART_INFO_SUCCESS:
        draft.state.loadChartInfoLoading = false;
        draft.state.loadChartInfoDone = true;
        draft.state.loadChartInfoError = null;
        draft.me.chart = action.data;

        break;
      case LOAD_CHART_INFO_FAILURE:
        draft.state.loadChartInfoError = action.error;
        break;

      case CHANGE_PROFILE_EMOJI_REQUEST:
        draft.state.changeProfileEmojiLoading = true;
        draft.state.changeProfileEmojiDone = false;
        draft.state.changeProfileEmojiError = null;
        break;
      case CHANGE_PROFILE_EMOJI_SUCCESS:
        draft.state.changeProfileEmojiLoading = false;
        draft.state.changeProfileEmojiDone = true;
        draft.state.changeProfileEmojiError = null;
        draft.me.UserProfile.emoji = action.data;

        break;
      case CHANGE_PROFILE_EMOJI_FAILURE:
        draft.state.changeProfileEmojiError = action.error;
        break;

      default:
        return state;
    }
  });
};

export default reducer;
