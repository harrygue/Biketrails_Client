import * as apiauth from '../api/auth'
// import { useLoggedInUser } from '../hooks/useLoggedInUser'
import {errorMessages,successMessages} from '../other/messages'
import {signinActions} from '../other/actionTypes'

export const signinReducer = (state,action) => {
    switch(action.type){
        case signinActions.REGISTER:
            registerUser(action.user,action.setMessage,action.history)
            return 'registered'
        case signinActions.LOGIN:
            return loginUser(action.user,action.setMessage,action.history)
        case signinActions.LOGOUT:
            logoutUser(action.setMessage,action.history)
            return null
        default:
            return action.history.push('/')
    }
}

const registerUser = async (userData,setMessage,history) => {
    try{
        const response = await apiauth.register(userData)
        if(response.status === 200){
            console.log(response.status, response.data)
            localStorage.setItem('profile',JSON.stringify(response.data))
            setMessage(successMessages.registerOk(response.data.message.username))
            history.push('/') // return JSON.parse(localStorage.getItem('profile')).message
        } 
    } catch(error){
        if(error.response){
            console.log(error.response)
            setMessage(errorMessages.registerFailure(error.response.data.error.message))
        } else {
            console.log('error handling')
            setMessage(errorMessages.generalError)
        }
        return null
    }
}

const loginUser = async (userData,setMessage,history) => {
    try{
        const response = await apiauth.login(userData)
        if(response.status === 200){
            if(response.data.message === 'No User Exists'){
                console.log('user does not exist')
                setMessage(errorMessages.loginFailure(response.data.message))
            } else {
                console.log(response.data)
                localStorage.setItem('profile',JSON.stringify(response.data))
                setMessage(successMessages.loginOk(response.data.message.username))
                return JSON.parse(localStorage.getItem('profile')).message
            }
        }
    } catch(error){
        console.log('HIT LOGIN ERROR')
        if(error.response){
            console.log(error.response)
            setMessage(errorMessages.loginFailure(error.response.data.error.message))
            // console.log(error.response.data)
            // if(error.response.data.name === "TokenExpiredError"){
            //     localStorage.clear()
            //     setMessage(errorMessages.sessionOut)
            // }
        } else {
            setMessage(errorMessages.generalError)
        }
        history.push('/')
    }
}

const logoutUser = (setMessage,history) => {
    apiauth.logout()
    .then(response => {
        if(response.status === 200){
            console.log(response.data)
            // setLoggedIn(false)
            localStorage.clear() //removeItem('profile')
            // setMessage('You logged out, see you next time !!!')
            setMessage(successMessages.logoutOk)
            history.push('/')
        }
    })
}