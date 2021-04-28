import {signinActions} from '../other/actionTypes'

export const signinReducer = (state,action) => {
    switch(action.type){
        case signinActions.REGISTER:
            return {...state,...action.user}
        case signinActions.LOGIN:
            return {...state,...action.user}
        case signinActions.LOGOUT:
            return null
        default:
            return localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message
    }
}
