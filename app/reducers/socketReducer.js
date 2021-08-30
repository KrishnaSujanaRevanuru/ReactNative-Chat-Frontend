

export const socketReducer = (state=null,action)=>{
    switch (action.type){
        case 'persist/REHYDRATE':{
            if(action.payload){
                return action.payload.socket;
            }else{
                return state;
            }
        }
        case 'CREATE_SOCKET': {
            return action.payload;
        }
        default: return state;
    }   
}
