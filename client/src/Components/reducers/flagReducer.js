export const initialFlag=false;

export const flagReducer=(flag,action)=>{
    if(action.type =="change"){
        return action.newflag;
    }
    return flag;
}