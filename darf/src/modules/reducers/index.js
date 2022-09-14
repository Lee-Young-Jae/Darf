import { combineReducers } from "redux";
import diary from "./diary.js";
import user from "./user";
import calendar from "./calendar";
import group from "./group";

const rootReducer = combineReducers({
  diary,
  user,
  calendar,
  group,
});

export default rootReducer;
