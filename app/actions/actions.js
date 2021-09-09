export const FETCH_USER = "FETCH_USER";
export const USER_LOGIN = "USER_LOGIN";
export const SUBMIT_REGISTER = "SUBMIT_REGISTER";
export const LOG_OUT = "LOG_OUT";
export const CREATE_CLIENT = "CREATE_CLIENT";;
export const PIN_CONVERSATION="PIN_CONVERSATION"

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
export const pin_conversation= (data) => (
    {
    type: PIN_CONVERSATION,
    data
})