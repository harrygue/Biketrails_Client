import * as apiauth from '../api/auth'
// import { useLoggedInUser } from '../hooks/useLoggedInUser'

export const signinReducer = (state,action) => {
    switch(action.type){
        case 'REGISTER':
            return registerUser(action.user,action.setMessage,action.history)
        case 'LOGIN':
            return loginUser(action.user,action.setMessage,action.history);
        case 'LOGOUT':
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
            setMessage(`Hello ${response.data.message.username}! Welcome as a new user !`)
            history.push('/') // return JSON.parse(localStorage.getItem('profile')).message
        } 
    } catch(error){
        if(error.response){
            console.log(error.response)
            setMessage(error.response.data.message)
        } else {
            console.log('error handling')
            setMessage('Ups, something went wrong !')
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
                setMessage(`${response.data.message}! Please try again or just watch our nice pictures !`)
            } else {
                console.log(response.data)
                localStorage.setItem('profile',JSON.stringify(response.data))
                setMessage(`Hello ${response.data.message.username}! Welcome back again !`)
                history.push('/')//return JSON.parse(localStorage.getItem('profile')).message
            }
        }
    } catch(error){
        console.log('HIT LOGIN ERROR')
        if(error.response){
            console.log(error.response.data)
            if(error.response.data.name === "TokenExpiredError"){
                localStorage.clear()
                setMessage('Your session expired, please login again !')
            }
        } else {
            setMessage('Ups, something went wrong !')
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
            setMessage('You logged out, see you next time !!!')
            history.push('/')
        }
    })
}