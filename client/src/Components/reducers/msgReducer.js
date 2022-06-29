export const initialMessage="";

export const messageReducer=(message,action)=>{
    if(action.type =="change"){
        return action.newValue;
    }
    return message;
}