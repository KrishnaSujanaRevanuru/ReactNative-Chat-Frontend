import { CREATE_CLIENT, FETCH_USER, PIN_CONVERSATION, LATEST_MESSAGES } from "../actions/actions";
import { USER_LOGIN } from "../actions/actions";
import { SUBMIT_REGISTER } from "../actions/actions";
import { LOG_OUT } from "../actions/actions";
import { STAR_MSGS,FETCHSUCCESS } from "../actions/actions"

const initialState = {
    userDetails: {
        username: '',
        email: '',
        mobile: '',
        profile: '',
        token: ''
    },
    client: null,
    pin_data: [],
    starMsgs: [],
    contacts:[],
    latestMessages: []
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
        case PIN_CONVERSATION:
            return Object.assign({}, state, { pin_data: action.data });
        case STAR_MSGS:
            return Object.assign({}, state, { starMsgs: action.data });
        case FETCHSUCCESS:
            return Object.assign({}, state, {contacts: action.payload });
        case LATEST_MESSAGES:
            let latestmsgs = [];
            console.log(action.payload)
            action.payload.map((msgs, msgsindex) => {
                let latestMessage = '';
                msgs.messages.map((msg, msgindex) => {
                if (msg.is_delete === undefined) {
                    latestMessage = msg;
                    }
                })
                latestmsgs.push(latestMessage);
            })
            return Object.assign({}, state, { latestMessages: latestmsgs });
        default: return state
    }

}

export default userReducer;
