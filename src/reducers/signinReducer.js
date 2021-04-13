import * as apiauth from '../api/auth'
// import { useLoggedInUser } from '../hooks/useLoggedInUser'

export const signinReducer = (state,action) => {
    switch(action.type){
        case 'REGISTER':
            registerUser(action.user,action.setMessage,action.history)
            return 'registered'
        case 'LOGIN':
            loginUser(action.user,action.setMessage,action.history)
            return 'signedin'
        case 'LOGOUT':
            logoutUser(action.setMessage,action.history)
            return null
        default:
            return state
    }
}

const registerUser = (userData,setMessage,history) => {
    apiauth.register(userData)
    .then(response => {
        if(response.status === 200){
            console.log(response.status, response.data)
            localStorage.setItem('profile',JSON.stringify(response.data))
            setMessage(`Hello ${response.data.message.username}! Welcome as a new user !`)
            history.push('/')
        }
    })
    .catch(error => {
        if(error.response){
            console.log(error.response.data)
            if(error.response.data.name === "TokenExpiredError"){
                localStorage.clear()
                setMessage('Your session expired, please login again !')
                history.push('/')
            } else {
                setMessage('Ups, something went wrong !')
                history.push('/')
            }
        }
    })
}

const loginUser = async (userData,setMessage,history) => {
    try{
        const response = await apiauth.login(userData)
        if(response.status === 200){
            console.log(response.data)
            localStorage.setItem('profile',JSON.stringify(response.data))
            // setLoggedInUser(localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message)
            setMessage(`Hello ${response.data.message.username}! Welcome back again !`)
            return response
            history.push('/')
        }
    } catch(error){
        if(error.response){
            console.log(error.response.data)
            if(error.response.data.name === "TokenExpiredError"){
                localStorage.clear()
                setMessage('Your session expired, please login again !')
                history.push('/')
            } else {
                setMessage('Ups, something went wrong !')
                history.push('/')
            }
        }
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