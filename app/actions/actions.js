import axios from 'axios';
export const FETCH_USER = "FETCH_USER";
export const USER_LOGIN = "USER_LOGIN";
export const SUBMIT_REGISTER = "SUBMIT_REGISTER";
export const LOG_OUT = "LOG_OUT";
export const CREATE_CLIENT = "CREATE_CLIENT";
export const PIN_CONVERSATION = "PIN_CONVERSATION";
export const STAR_MSGS = 'STAR_MSGS';
export const FETCHSUCCESS='FETCHSUCCESS';

export const fetchUser = (user) => {
    return {
        type: FETCH_USER,
        user
    }
}

export const userLogin = (data) => ({
    type: USER_LOGIN,
    data
});

export const submitRegister = (userDetails) => ({
    type: SUBMIT_REGISTER,
    userDetails
});

export const logOut = () => ({
    type: 'LOG_OUT',
});

export const createClient = (data) => ({
    type: CREATE_CLIENT,
    payload: data
});
export const pin_conversation = (data) => ({
    type: PIN_CONVERSATION,
    data
});

export const starMsgs = (data) => ({
    type: STAR_MSGS,
    data
})
export const fetchSuccess=(data)=>({
    type: FETCHSUCCESS,
    payload: data,

})

export const fetchContacts = (token) => {
    return (dispatch) => {
        axios.request({
                method: "POST",
                url: `https://ptchatindia.herokuapp.com/contacts`,
                headers: {
                    authorization: token,
                },
            })
        .then(response => {
            const result = response;
            dispatch(fetchSuccess(result.data));
        }).catch(error => {
            console.error('Error Occurred.....!', error)
        });
    }
}
            