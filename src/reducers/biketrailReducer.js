import * as api from '../api'
import {biketrailActions, imageActions} from '../other/actionTypes'
import {successMessages,errorMessages} from '../other/messages'



export const biketrailReducer = (state,action) => {
    // console.log('biketrailReducer',state)
    switch(action.type){
        // GET IS NOT USED YET IN DISPATCH
        case biketrailActions.GETBYID:
            return {...state,...action.biketrail}
        case biketrailActions.DELETE:
            console.log(`DELETEBIKETRAIL`)
            deleteBikeTrail(action.id,action.setMessage,action.setAction,action.history)
            return {message:'Biketrail deleted'}
        case imageActions.DELETE:
            return {...state,...action.id}
        default:
            return state
    }
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
        if(err.response.status === 401){
            console.log(err.response)
            setMessage(errorMessages.notAuthorized)
        } else {
            console.log('update biketrail error: else')
            setMessage(errorMessages.generalError)
        }
        history.push('/')
    })
}