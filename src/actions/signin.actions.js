import {signinActions} from '../other/actionTypes'
import * as apiauth from '../api/auth'
import {successMessages,errorMessages} from '../other/messages'
import {setCookie,deleteCookie, getCookie} from '../other/cookieActions'


export const registerUser = async (userData,setMessage,setOpen,dispatch) => {
    try{
        const response = await apiauth.register(userData)
        if(response.status === 200){
            console.log(response.status, response.data)
            // localStorage.setItem('profile',JSON.stringify(response.data))
            setCookie('user',JSON.stringify(response.data),5)
            setMessage(successMessages.registerOk(response.data.message.username))
            dispatch({type:signinActions.LOGIN,user:response.data.message})
        } 
    } catch(error){
        if(error.response){
            console.log(error.response)
            setMessage(errorMessages.registerFailure(error.response.data.error.message))
        } else {
            console.log('error handling')
            setMessage(errorMessages.generalError)
        }
        setOpen(false)
        return null
    }
}

export const loginUser = async (userData,setMessage,setOpen,dispatch) => {
    try{
        const response = await apiauth.login(userData)
        if(response.status === 200){
            if(response.data.message === 'No User Exists'){
                console.log('user does not exist')
                setMessage(errorMessages.loginFailure(response.data.message))
            } else {
                // localStorage.setItem('profile',JSON.stringify(response.data))
                setCookie('user',JSON.stringify(response.data),5)
                console.log(getCookie('user'))
                setMessage(successMessages.loginOk(response.data.message.username))
                dispatch({type:signinActions.LOGIN,user:response.data.message})
            }
        }
    } catch(error){
        console.log('HIT LOGIN ERROR')
        if(error.response){
            console.log(error.response)
            setMessage(errorMessages.loginFailure(error.response.data.error.message))
        } else {
            setMessage(errorMessages.generalError)
        }
        setOpen(false)
        return null
    }
}

export const logoutUser = (setMessage,dispatch) => {
    apiauth.logout()
    .then(response => {
        if(response.status === 200){
            console.log(response.data)
            //localStorage.clear() //removeItem('profile')
            deleteCookie('user')
            setMessage(successMessages.logoutOk)
            dispatch({type:signinActions.LOGOUT})
        }
    })
}