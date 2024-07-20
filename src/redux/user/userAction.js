import { UserTypes } from "./userTypes"

export const setToken=(token)=>{
    return {
        type:UserTypes.USER_TOKEN,
        payload:token
    }
}
export const setRFToken=(token)=>{
    return {
        type:UserTypes.USER_RFTOKEN,
        payload:token
    }
}
export const setName=(name)=>{
    console.log(name);
    return {
        type:UserTypes.USER_SET_NAME,
        payload:name
    }
}
export const setEmail=(email)=>{
    return {
        type:UserTypes.USER_SET_EMAIL,
        payload:email
    }
}
export const setMobile=(mobile)=>{
    return {
        type:UserTypes.USER_SET_MOBILE,
        payload:mobile
    }
}
export const setUsername=(username)=>{
    return {
        type:UserTypes.USER_SET_USERNAME,
        payload:username
    }
}
export const  setUserAccess=(access)=>{
    return {
        type:UserTypes.USER_SET_USERACCESS,
        payload:access
    }
}


export const setRole=(role)=>{
    return {
        type:UserTypes.USER_SET_ROLE,
        payload:role
    }
}