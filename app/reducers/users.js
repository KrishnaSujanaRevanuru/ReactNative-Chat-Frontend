import { CREATE_CLIENT, FETCH_USER } from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import { SUBMIT_REGISTER } from "../actions/actions";
import { LOG_OUT,STAR_MSGS } from "../actions/actions";


const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    },
    client: null,
    starMsgs: [],
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER:
            return Object.assign({}, state, { userDetails: action.user });
        case USER_LOGIN:
            return Object.assign({}, state, { userDetails: action.data });
        case SUBMIT_REGISTER:
            return Object.assign({}, state, { userDetails: action.userDetails });
        case LOG_OUT:
            return initialState;
        case CREATE_CLIENT:
            return Object.assign({}, state, { client: action.payload });
        case STAR_MSGS:
            return Object.assign({}, state, { starMsgs: action.data });
        default: return state
    }

}

export default userReducer;
