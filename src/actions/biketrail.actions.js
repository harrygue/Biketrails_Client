import {biketrailActions,signinActions} from '../other/actionTypes'
import * as api from '../api'
import {successMessages,errorMessages} from '../other/messages'
import {deleteCookie} from '../other/cookieActions'


export const fetchBiketrails = async(dispatch,setMessage,history) => {
    try{
        const response = await api.getBikeTrails()
        if(response.status === 200){
            dispatch({type:biketrailActions.GETALLBIKETRAILS,biketrails:response.data.biketrails})
        }
    } catch(error){
        console.log(error)
        setMessage("Ops, something went wrong !")
        history.push('/')
    }
}

export const fetchBiketrailById = async (id,dispatch,setMessage,history) => {
    try {
        const response = await api.getBikeTrail(id)
        dispatch({type:biketrailActions.GETBYID,biketrail:response.data.biketrail})
    } catch(error){
        setMessage("Ops, something went wrong !")
        history.push('/')
    }
}

export const createBiketrail = (data,setMessage,setOpen,history,dispatchLoggedInUser) => {
    api.createBikeTrail(data)
    .then(response => {
        if(response.status === 200){
            console.log(response.data.message)
            setMessage(successMessages.createBiketrailOk(response.data.biketrail.name))  
            setOpen(false)
        }
    })
    .catch(err => {
        console.log(err)
        if(err.response.status === 401){
            setMessage(errorMessages.notAuthorized)
            // localStorage.clear()
            deleteCookie('user')
            dispatchLoggedInUser({type:signinActions.LOGOUT})
        } else {
            console.log('create biketrail error: else')
            setMessage(errorMessages.createFailure(err.response.data.error.message))
        }
        history.push('/')
    })
}

export const updateBiketrail = (id,data,setMessage,history,dispatchLoggedInUser) => { 
    api.updateBikeTrail(id,data)
    .then(response => {
       if(response.status === 200){
           console.log(response)
           setMessage(successMessages.updateBiketrailOk(response.data.biketrail.name))  
       }
    })
    .catch(err => {
        console.log(err)
        if(err.response && err.response.status === 401){
            setMessage(errorMessages.notAuthorized)
            localStorage.clear()
            dispatchLoggedInUser({type:signinActions.LOGOUT})
        } else {
            console.log(err)
            setMessage(errorMessages.updateFailure('Ops, something was wrong!'))
        }
        history.push('/')
    })
}

export const deleteBiketrail = (id,setMessage,history,dispatchLoggedInUser) => {
    api.deleteBikeTrail(id)
    .then(response => {
      console.log(response)
      if(response.status === 200){
        console.log(response.data.message)
        setMessage(successMessages.deleteBiketrailOk(id))
      }
    })
    .catch(err => {
        console.log(err)
        if(err.response.status === 401){
            setMessage(errorMessages.notAuthorized)
            localStorage.clear()
            dispatchLoggedInUser({type:signinActions.LOGOUT})
        } else {
            console.log('update biketrail error: else')
            setMessage(errorMessages.generalError)
        }
        history.push('/')
    })
}

