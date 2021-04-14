import * as api from '../api'
import {biketrailActions} from '../other/actionTypes'
import {successMessages,errorMessages} from '../other/messages'


export const biketrailReducer = (state,action) => {
    console.log('biketrailReducer')
    switch(action.type){
        // GET IS NOT USED YET IN DISPATCH
        case biketrailActions.GETBYID:
            getBiketrail(action.id,action.setBiketrail,action.setMessage)
            return null
        case biketrailActions.CREATE:
            console.log('CREATEBIKETRAIL:')
            createBiketrail(action.formData,action.setMessage,action.setOpen,action.history)
            return {message:'Biketrail created'}
        case biketrailActions.UPDATE:
            console.log(`UPDATEBIKETRAIL`)
            updateBiketrail(action.biketrailId,action.formData,action.setMessage,action.setStatus,action.setAction,action.history)
            return {message:'Biketrail updated'}
        case biketrailActions.DELETE:
            console.log(`DELETEBIKETRAIL`)
            deleteBikeTrail(action.id,action.setMessage,action.setAction,action.history)
            return {message:'Biketrail deleted'}
        default:
            return state
    }
}

const getBiketrail = (id,setMessage,setBiketrail) => {
    console.log('getBiketrail in biketrailReducer.js')
    api.getBikeTrail(id)
    .then(response => {
        if(response.status === 200){
            console.log(response.data.biketrail)
            setBiketrail(response.data.biketrail)
        }
    })
    .catch(error => {
        console.log(error)
        setMessage(errorMessages.renderFailure(error.response.data.error.message))
    })
}

const createBiketrail = (data,setMessage,setOpen,history) => {
    console.log('createBiketrail in biketrailReducer.js')
    api.createBikeTrail(data)
    .then(response => {
        if(response.status === 200){
            console.log(response.data.message)
            setMessage(successMessages.createBiketrailOk(response.data.biketrail.name))  
            setOpen(false)
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