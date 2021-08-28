import { combineReducers } from "redux";
import userReducer from "./users";
import { socketReducer } from './socketReducer';
export default combineReducers({
    user : userReducer
});