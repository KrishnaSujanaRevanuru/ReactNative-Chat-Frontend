import { CREATE_CLIENT, FETCH_USER, PIN_CONVERSATION, LATEST_MESSAGES, ARCHIVE_LATEST_MESSAGES} from "../actions/actions";
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
    latestMessages: [],
    archivelatestMessages:[]
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
        case PIN_CONVERSATION:
            return Object.assign({}, state, { pin_data: action.data });
        case STAR_MSGS:
            return Object.assign({}, state, { starMsgs: action.data });
        case FETCHSUCCESS:
            return Object.assign({}, state, {contacts: action.payload });
        case LATEST_MESSAGES:
            let latestmsgs = [];
            action.payload.map((msgs, msgsindex) => {
                let latestMessage = '';
                let msg=msgs.messages;
                const filteredLatestMsg=msg.filter(
                    msg=>msg.is_delete===undefined
                )
                if(filteredLatestMsg.length>0){
                    latestMessage=filteredLatestMsg[filteredLatestMsg.length-1];
                }
                latestmsgs.push(latestMessage)
            })
            return Object.assign({}, state, { latestMessages: latestmsgs });
        case ARCHIVE_LATEST_MESSAGES:
            let archivelatestmsgs = [];
            action.payload.map((msgs, msgsindex) => {
                let latestMessage = '';
                let msg=msgs.messages;
                const filteredLatestMsg=msg.filter(
                    msg=>msg.is_delete===undefined
                )
                if(filteredLatestMsg.length>0){
                    latestMessage=filteredLatestMsg[filteredLatestMsg.length-1];
                }
                archivelatestmsgs.push(latestMessage)
            })
            return Object.assign({}, state, { archivelatestMessages: archivelatestmsgs });
        default: return state
    }

}

export default userReducer;
