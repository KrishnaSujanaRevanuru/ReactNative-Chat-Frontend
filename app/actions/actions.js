export const FETCH_USER = "FETCH_USER";
export const USER_LOGIN = "USER_LOGIN";
export const SUBMIT_REGISTER = "SUBMIT_REGISTER";
export const LOG_OUT = "LOG_OUT";
export const CREATE_CLIENT = "CREATE_CLIENT";

export const fetchUser = (user) => {
    console.log("actions")
    return {
        type: FETCH_USER,
        user
    }
}

export const userLogin = (data) => ({
    type: USER_LOGIN,
    data
});

export const submitRegister = (details) => ({
    type: SUBMIT_REGISTER,
    details
});

export const logOut = () => ({
    type: 'LOG_OUT',
});

export const createClient = (data) => ({
    type: CREATE_CLIENT,
    payload: data
});