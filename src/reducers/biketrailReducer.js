import * as api from '../api'
import {biketrailActions, imageActions} from '../other/actionTypes'
import {successMessages,errorMessages} from '../other/messages'



export const biketrailReducer = (state,action) => {
    console.log('biketrailReducer',state)
    switch(action.type){
        case biketrailActions.GETALLBIKETRAILS:
            return action.biketrails
        case biketrailActions.CREATE:
            console.log('CREATEBIKETRAIL:')
            return [...state,action.biketrail]
        case biketrailActions.UPDATE:
            console.log(`UPDATEBIKETRAIL`,action.biketrail)
            console.log(state.map(biketrail => biketrail._id === action.biketrail._id ? action.biketrail : biketrail))
            localStorage.setItem('biketrail',JSON.stringify(action.biketrail))
            return state.map(biketrail => biketrail._id === action.biketrail._id ? action.biketrail : biketrail)
        case biketrailActions.DELETE:
            console.log(`DELETEBIKETRAIL`,action.id)
            return state.filter(biketrail => biketrail._id !== action.id)
        case imageActions.CREATE:
            return state.map(biketrail => biketrail._id === action.biketrail._id ? action.biketrail : biketrail)
        // not active yet
            case imageActions.DELETE:
            return {...state,...action.id}
        default:
            return state
    }
}

/*
const createBiketrail = (data,setMessage,setOpen,history) => {
    console.log('createBiketrail in biketrailReducer.js')
    api.createBikeTrail(data)
    .then(response => {
        if(response.status === 200){
            console.log(response.data.message)
            setMessage(successMessages.createBiketrailOk(response.data.biketrail.name))  
            setOpen(false)
            return response.data.biketrail
        }
    })
    .catch(err => {
        console.log(err.response)
        if(err.response.status === 401){
            setMessage(errorMessages.notAuthorized)
        } else {
            console.log('create biketrail error: else')
            setMessage(errorMessages.createFailure(err.response.data.error.message))
        }
        history.push('/')
    })
}


const updateBiketrail = (id,data,setMessage,setStatus,setAction,history) => {
    api.updateBikeTrail(id,data)
    .then(response => {
       if(response.status === 200){
           console.log(response)
           setStatus('success')
           setMessage(successMessages.updateBiketrailOk(response.data.biketrail.name))  
           setAction(null)
           return response.data.biketrail
       }
    })
    .catch(err => {
        console.log(err.response)
        if(err.response.status === 401){
            setMessage(errorMessages.notAuthorized)
        } else {
            console.log('update biketrail error: else')
            setMessage(errorMessages.updateFailure(err.response.data.error.message))
        }
        history.push('/')
    })
}

const deleteBikeTrail = (id,setMessage,setAction,history) => {
    api.deleteBikeTrail(id)
    .then(response => {
      console.log(JSON.stringify(response))
      if(response.status === 200){
        console.log(response.data.message)
        setMessage(successMessages.deleteBiketrailOk(id))
        setAction(response.data.message)
        history.push('/')
      }
    })
    .catch(err => {
        console.log(err.response)
        if(err.response.status === 401){
            setMessage(errorMessages.notAuthorized)
        } else {
            console.log('update biketrail error: else')
            setMessage(errorMessages.generalError)
        }
        history.push('/')
    })
}
*/