

export const socketReducer = (state=null,action)=>{
    console.log('coming here');
    switch (action.type){
        case 'persist/REHYDRATE':{
            if(action.payload){
                return action.payload.socket;
            }else{
                return state;
            }
        }
        case 'CREATE_SOCKET': {
            console.log(action,'create socket');
            return action.payload;
        }
        default: return state;
    }   
}
