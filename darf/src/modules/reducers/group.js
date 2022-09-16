import produce from "immer";

const initialState = {
  state: {
    loadRegistedGroupLoading: false, // 내가 가입한 그룹 목록 불러오기 시도중
    loadRegistedGroupDone: false,
    loadRegistedGroupError: null,

    createGroupLoading: false, // 그룹 만들기 시도중
    createGroupDone: false,
    createGroupError: null,

    searchGroupLoading: false, // 가입할 그룹 검색 시도중
    searchGroupDone: false,
    searchGroupError: null,

    loadSelectedGroupLoading: false, //그룹 페이지에서 선택한 그룹 정보 (Board 포함한) 불러오기 시도중
    loadSelectedGroupDone: false,
    loadSelectedGroupError: null,

    joinGroupLoading: false, // 그룹 가입 시도중
    joinGroupDone: false,
    joinGroupError: null,

    createGroupPostLoading: false, // 그룹 게시글 생성 시도중
    createGroupPostDone: false,
    createGroupPostError: null,

    removeGroupPostLoading: false, // 그룹 게시글 삭제 시도중
    removeGroupPostDone: false,
    removeGroupPostError: null,

    likePostLoading: false, //포스트 좋아요 시도중
    likePostDone: false,
    likePostError: null,

    createCommentLoading: false, //게시글 코멘트 달기 시도중
    createCommentDone: false,
    createCommentError: null,

    loadGroupUserPostLoading: false, //유저 게시글 가져오기 시도중
    loadGroupUserPostDone: false,
    loadGroupUserPostError: null,

    editGroupLoading: false, //그룹 정보 변경 시도중
    editGroupDone: false,
    editGroupError: null,

    leaveGroupLoading: false, //그룹 탈퇴 시도중
    leaveGroupDone: false,
    leaveGroupError: null,

    dropUserLoading: false, // 유저 추방 시도중
    dropUserDone: false,
    dropUserError: null,

    removeGroupLoading: false, //그룹 삭제 시도중
    removeGroupDone: false,
    removeGroupError: null,

    changeGroupAdminLoading: false, //그룹 양도 시도중
    changeGroupAdminDone: false,
    changeGroupAdminError: null,

    loadGroupPostsLoading: false, //그룹 게시글 로드 시도중 (인피니티 스크롤링)
    loadGroupPostsDone: false,
    loadGroupPostsError: null,
  },
  group: {
    myGroup: [],
    selected: { GroupPosts: [], Users: [] },
    searchedGroup: [],
    test: [],
  },
};

/* 액션 타입 만들기 */
export const INIT = "INIT";

export const LOAD_REGISTED_GROUP_REQUEST = "LOAD_REGISTED_GROUP_REQUEST";
export const LOAD_REGISTED_GROUP_SUCCESS = "LOAD_REGISTED_GROUP_SUCCESS";
export const LOAD_REGISTED_GROUP_FAILURE = "LOAD_REGISTED_GROUP_FAILURE";

export const GROUP_CREATE_REQUEST = "GROUP_CREATE_REQUEST";
export const GROUP_CREATE_SUCCESS = "GROUP_CREATE_SUCCESS";
export const GROUP_CREATE_FAILURE = "GROUP_CREATE_FAILURE";

export const SEARCH_GROUP_REQUEST = "SEARCH_GROUP_REQUEST";
export const SEARCH_GROUP_SUCCESS = "SEARCH_GROUP_SUCCESS";
export const SEARCH_GROUP_FAILURE = "SEARCH_GROUP_FAILURE";

export const LOAD_SELECTED_GROUP_REQUEST = "LOAD_SELECTED_GROUP_REQUEST";
export const LOAD_SELECTED_GROUP_SUCCESS = "LOAD_SELECTED_GROUP_SUCCESS";
export const LOAD_SELECTED_GROUP_FAILURE = "LOAD_SELECTED_GROUP_FAILURE";

export const CREATE_GROUP_POST_REQUEST = "CREATE_GROUP_POST_REQUEST";
export const CREATE_GROUP_POST_SUCCESS = "CREATE_GROUP_POST_SUCCESS";
export const CREATE_GROUP_POST_FAILURE = "CREATE_GROUP_POST_FAILURE";

export const CREATE_COMMENT_REQUEST = "CREATE_COMMENT_REQUEST";
export const CREATE_COMMENT_SUCCESS = "CREATE_COMMENT_SUCCESS";
export const CREATE_COMMENT_FAILURE = "CREATE_COMMENT_FAILURE";

export const JOIN_GROUP_REQUEST = "JOIN_GROUP_REQUEST";
export const JOIN_GROUP_SUCCESS = "JOIN_GROUP_SUCCESS";
export const JOIN_GROUP_FAILURE = "JOIN_GROUP_FAILURE";

export const LIKE_POST_REQUEST = "LIKE_POST_REQUEST";
export const LIKE_POST_SUCCESS = "LIKE_POST_SUCCESS";
export const LIKE_POST_FAILURE = "LIKE_POST_FAILURE";

export const LOAD_GROUP_USERPOST_REQUEST = "LOAD_GROUP_USERPOST_REQUEST";
export const LOAD_GROUP_USERPOST_SUCCESS = "LOAD_GROUP_USERPOST_SUCCESS";
export const LOAD_GROUP_USERPOST_FAILURE = "LOAD_GROUP_USERPOST_FAILURE";

export const REMOVE_GROUP_POST_REQUEST = "REMOVE_GROUP_POST_REQUEST";
export const REMOVE_GROUP_POST_SUCCESS = "REMOVE_GROUP_POST_SUCCESS";
export const REMOVE_GROUP_POST_FAILURE = "REMOVE_GROUP_POST_FAILURE";

export const LEAVE_GROUP_REQUEST = "LEAVE_GROUP_REQUEST";
export const LEAVE_GROUP_SUCCESS = "LEAVE_GROUP_SUCCESS";
export const LEAVE_GROUP_FAILURE = "LEAVE_GROUP_FAILURE";

export const EDIT_GROUP_REQUEST = "EDIT_GROUP_REQUEST";
export const EDIT_GROUP_SUCCESS = "EDIT_GROUP_SUCCESS";
export const EDIT_GROUP_FAILURE = "EDIT_GROUP_FAILURE";

export const DROP_USER_REQUEST = "DROP_USER_REQUEST";
export const DROP_USER_SUCCESS = "DROP_USER_SUCCESS";
export const DROP_USER_FAILURE = "DROP_USER_FAILURE";

export const REMOVE_GROUP_REQUEST = "REMOVE_GROUP_REQUEST";
export const REMOVE_GROUP_SUCCESS = "REMOVE_GROUP_SUCCESS";
export const REMOVE_GROUP_FAILURE = "REMOVE_GROUP_FAILURE";

export const CHANGE_GROUP_ADMIN_REQUEST = "CHANGE_GROUP_ADMIN_REQUEST";
export const CHANGE_GROUP_ADMIN_SUCCESS = "CHANGE_GROUP_ADMIN_SUCCESS";
export const CHANGE_GROUP_ADMIN_FAILURE = "CHANGE_GROUP_ADMIN_FAILURE";

export const LOAD_GROUP_POSTS_REQUEST = "LOAD_GROUP_POSTS_REQUEST";
export const LOAD_GROUP_POSTS_SUCCESS = "LOAD_GROUP_POSTS_SUCCESS";
export const LOAD_GROUP_POSTS_FAILURE = "LOAD_GROUP_POSTS_FAILURE";

/* 리듀서 선언 */

const reducer = (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case INIT:
        draft.group = action.data;
        break;
      case LOAD_REGISTED_GROUP_REQUEST:
        draft.state.loadRegistedGroupLoading = true;
        draft.state.loadRegistedGroupDone = false;
        draft.state.loadRegistedGroupError = null;
        draft.state.loadSelectedGroupDone = false; //Group 페이지 로드시 선택된 그룹도 초기화
        draft.state.joinGroupError = null; // 가입 그룹 Error도 초기화
        draft.state.createGroupDone = false; // 그룹 만들기 성공도 초기화
        draft.state.joinGroupDone = false; //가입 성공 Done도 초기화
        draft.state.removeGroupDone = false; //그룹 지우기 Done 초기화
        draft.state.removeGroupError = null; // 그룹 지우기 Error도 초기화

        break;
      case LOAD_REGISTED_GROUP_SUCCESS:
        draft.state.loadRegistedGroupLoading = false;
        draft.state.loadRegistedGroupDone = true;
        draft.state.loadRegistedGroupError = null;
        draft.group.myGroup = action.data;
        break;
      case LOAD_REGISTED_GROUP_FAILURE:
        draft.state.loadRegistedGroupError = action.error;
        break;
      case GROUP_CREATE_REQUEST:
        draft.state.createGroupLoading = true;
        draft.state.createGroupDone = false;
        draft.state.createGroupError = null;
        break;
      case GROUP_CREATE_SUCCESS:
        draft.state.createGroupLoading = false;
        draft.state.createGroupDone = true;
        draft.state.createGroupError = null;
        draft.group.myGroup.push(action.data);
        break;
      case GROUP_CREATE_FAILURE:
        draft.state.createGroupError = action.error;
        break;

      case SEARCH_GROUP_REQUEST:
        draft.state.searchGroupLoading = true;
        draft.state.searchGroupDone = false;
        draft.state.searchGroupError = null;
        break;
      case SEARCH_GROUP_SUCCESS:
        draft.state.searchGroupLoading = false;
        draft.state.searchGroupDone = true;
        draft.state.searchGroupError = null;
        draft.group.searchedGroup = action.data;
        break;
      case SEARCH_GROUP_FAILURE:
        draft.state.searchGroupError = action.error;
        break;

      case LOAD_SELECTED_GROUP_REQUEST:
        draft.state.loadSelectedGroupLoading = true;
        draft.state.loadSelectedGroupDone = false;
        draft.state.loadSelectedGroupError = null;
        draft.state.leaveGroupError = null; // 그룹 탈퇴 Error 초기화
        draft.state.leaveGroupDone = false; // 그룹 탈퇴 성공 초기화
        draft.state.loadGroupUserPostError = null; // 그룹의 해당 유저 포스트 불러오기 에러도 초기화

        break;
      case LOAD_SELECTED_GROUP_SUCCESS:
        draft.state.loadSelectedGroupLoading = false;
        draft.state.loadSelectedGroupDone = true;
        draft.state.loadSelectedGroupError = null;
        draft.group.selected = action.data;
        draft.group.selected.GroupPosts = [];
        draft.group.selected.postLastId = 0;
        break;
      case LOAD_SELECTED_GROUP_FAILURE:
        draft.state.loadSelectedGroupError = action.error;
        break;

      case LOAD_GROUP_USERPOST_REQUEST:
        draft.state.loadGroupUserPostLoading = true;
        draft.state.loadGroupUserPostDone = false;
        draft.state.loadGroupUserPostError = null;
        break;
      case LOAD_GROUP_USERPOST_SUCCESS:
        draft.state.loadGroupUserPostLoading = false;
        draft.state.loadGroupUserPostDone = true;
        draft.state.loadGroupUserPostError = null;
        draft.group.selected = action.data;
        break;
      case LOAD_GROUP_USERPOST_FAILURE:
        draft.state.loadGroupUserPostError = action.error;
        break;

      case JOIN_GROUP_REQUEST:
        draft.state.joinGroupLoading = true;
        draft.state.joinGroupDone = false;
        draft.state.joinGroupError = null;
        break;
      case JOIN_GROUP_SUCCESS:
        draft.state.joinGroupLoading = false;
        draft.state.joinGroupDone = true;
        draft.state.joinGroupError = null;
        draft.group.myGroup.unshift(action.data);
        break;
      case JOIN_GROUP_FAILURE:
        draft.state.joinGroupError = action.error;
        break;

      case CREATE_GROUP_POST_REQUEST:
        draft.state.createGroupPostLoading = true;
        draft.state.createGroupPostDone = false;
        draft.state.createGroupPostError = null;
        break;
      case CREATE_GROUP_POST_SUCCESS:
        draft.state.createGroupPostLoading = false;
        draft.state.createGroupPostDone = true;
        draft.state.createGroupPostError = null;
        // draft.group.selected.push(action.data);
        break;
      case CREATE_GROUP_POST_FAILURE:
        draft.state.createGroupPostError = action.error;
        break;

      case REMOVE_GROUP_POST_REQUEST:
        draft.state.removeGroupPostLoading = true;
        draft.state.removeGroupPostDone = false;
        draft.state.removeGroupPostError = null;
        break;
      case REMOVE_GROUP_POST_SUCCESS:
        draft.state.removeGroupPostLoading = false;
        draft.state.removeGroupPostDone = true;
        draft.state.removeGroupPostError = null;
        draft.group.selected.GroupPosts =
          draft.group.selected.GroupPosts.filter((post) => {
            return post.id !== parseInt(action.data.id);
          });
        break;
      case REMOVE_GROUP_POST_FAILURE:
        draft.state.removeGroupPostError = action.error;
        break;

      case CREATE_COMMENT_REQUEST:
        draft.state.createCommentLoading = true;
        draft.state.createCommentDone = false;
        draft.state.createCommentError = null;
        break;
      case CREATE_COMMENT_SUCCESS:
        draft.state.createCommentLoading = false;
        draft.state.createCommentDone = true;
        draft.state.createCommentError = null;
        draft.group.selected.GroupPosts.find((post) => {
          return post.id === action.data.GroupPostId;
        }).PostComments.push(action.data);
        break;
      case CREATE_COMMENT_FAILURE:
        draft.state.createGroupPostError = action.error;
        break;

      case LIKE_POST_REQUEST:
        draft.state.likePostLoading = true;
        draft.state.likePostDone = false;
        draft.state.likePostError = null;
        break;
      case LIKE_POST_SUCCESS:
        draft.state.likePostLoading = false;
        draft.state.likePostDone = true;
        draft.state.likePostError = null;
        draft.group.selected.GroupPosts.find((post) => {
          return post.id === action.data.postId;
        }).like = action.data.like;
        break;
      case LIKE_POST_FAILURE:
        draft.state.likePostError = action.error;
        break;

      case LEAVE_GROUP_REQUEST:
        draft.state.leaveGroupLoading = true;
        draft.state.leaveGroupDone = false;
        draft.state.leaveGroupError = null;
        break;
      case LEAVE_GROUP_SUCCESS:
        draft.state.leaveGroupLoading = false;
        draft.state.leaveGroupDone = true;
        draft.state.leaveGroupError = null;
        break;
      case LEAVE_GROUP_FAILURE:
        draft.state.leaveGroupError = action.error;
        break;

      case EDIT_GROUP_REQUEST:
        draft.state.editGroupLoading = true;
        draft.state.editGroupDone = false;
        draft.state.editGroupError = null;
        break;
      case EDIT_GROUP_SUCCESS:
        draft.state.editGroupLoading = false;
        draft.state.editGroupDone = true;
        draft.state.editGroupError = null;
        draft.group.selected = {
          ...draft.group.selected,
          name: action.data.name,
          emoji: action.data.emoji,
          introduce: action.data.introduce,
          password: action.data.password,
        };
        break;
      case EDIT_GROUP_FAILURE:
        draft.state.editGroupError = action.error;
        break;

      case DROP_USER_REQUEST:
        draft.state.dropUserLoading = true;
        draft.state.dropUserDone = false;
        draft.state.dropUserError = null;
        break;
      case DROP_USER_SUCCESS:
        draft.state.dropUserLoading = false;
        draft.state.dropUserDone = true;
        draft.state.dropUserError = null;
        draft.group.selected.GroupPosts =
          draft.group.selected.GroupPosts.filter(
            (item) => item.UserId !== parseInt(action.data)
          );
        draft.group.selected.Users = draft.group.selected.Users.filter(
          (item) => item.id !== parseInt(action.data)
        );
        break;
      case DROP_USER_FAILURE:
        draft.state.dropUserError = action.error;
        break;

      case REMOVE_GROUP_REQUEST:
        draft.state.removeGroupLoading = true;
        draft.state.removeGroupDone = false;
        draft.state.removeGroupError = null;
        break;
      case REMOVE_GROUP_SUCCESS:
        draft.state.removeGroupLoading = false;
        draft.state.removeGroupDone = true;
        draft.state.removeGroupError = null;
        break;
      case REMOVE_GROUP_FAILURE:
        draft.state.removeGroupError = action.error;
        break;

      case CHANGE_GROUP_ADMIN_REQUEST:
        draft.state.changeGroupAdminLoading = true;
        draft.state.changeGroupAdminDone = false;
        draft.state.changeGroupAdminError = null;
        break;
      case CHANGE_GROUP_ADMIN_SUCCESS:
        draft.state.changeGroupAdminLoading = false;
        draft.state.changeGroupAdminDone = true;
        draft.state.changeGroupAdminError = null;
        break;
      case CHANGE_GROUP_ADMIN_FAILURE:
        draft.state.changeGroupAdminError = action.error;
        break;
      case LOAD_GROUP_POSTS_REQUEST:
        draft.state.loadGroupPostsLoading = true;
        draft.state.loadGroupPostsDone = false;
        draft.state.loadGroupPostsError = null;
        break;
      case LOAD_GROUP_POSTS_SUCCESS:
        draft.state.loadGroupPostsLoading = false;
        draft.state.loadGroupPostsDone = true;
        draft.state.loadGroupPostsError = null;
        draft.group.selected.GroupPosts =
          draft.group.selected.GroupPosts.concat(action.data);
        break;
      case LOAD_GROUP_POSTS_FAILURE:
        draft.state.loadGroupPostsError = action.error;
        break;

      default:
        return state;
    }
  });
};

export default reducer;
