import io from "socket.io-client";
let socket = null;
export function socketConnect(cb){
    if(!socket){
        socket = io('https://ptchatindia.herokuapp.com/', { transports: ['websocket'] });
    }
    cb(socket);
}
export function getSocket(){
    return socket;
}