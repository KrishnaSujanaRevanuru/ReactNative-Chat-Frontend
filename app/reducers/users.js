import { CREATE_CLIENT, FETCH_USER } from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import { SUBMIT_REGISTER } from "../actions/actions";
import { LOG_OUT } from "../actions/actions";


const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    },
    client: null
}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USER:
            console.log("fetch user");
            return Object.assign({}, state, { userDetails: action.user });
        case USER_LOGIN:
            console.log(" user login");
            return Object.assign({}, state, { userDetails: action.data });
        case SUBMIT_REGISTER:
            console.log("user register");
            return Object.assign({}, state, { userDetails: action.userDetails });
        case LOG_OUT:
            console.log('log out');
            return initialState;
        case CREATE_CLIENT:
            return Object.assign({}, state, { client: action.payload });
        default: return state
    }

}

export default userReducer;
