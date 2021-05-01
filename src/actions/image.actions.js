import {signinActions} from '../other/actionTypes'
import * as api from '../api'
import {successMessages,errorMessages} from '../other/messages'

export const createImage = (biketrailId,formData,setMessage,history,dispatchLoggedInUser) => {
    api.createImage(biketrailId,formData)
        .then(response => {
            if(response.status === 201){
                console.log(response.data.biketrail)
                setMessage(successMessages.addImageOk)
            }
        })
        .catch(err => {
            if(err.response.status === 401){
                setMessage(errorMessages.notAuthorized)
                localStorage.clear()
                dispatchLoggedInUser({type:signinActions.LOGOUT})
            } else {
                console.log('create biketrail error: else')
                setMessage(errorMessages.createFailure(err.response.data.error.message))
            }
            history.push('/')
        })
}

export const deleteImage = (biketrail_id,imageId,setMessage,history,dispatchLoggedInUser) => {
    api.deleteImage(biketrail_id,imageId)
    .then(response => {
      console.log(response)
      setMessage('Image deleted!')
      history.push(`/biketrails/${biketrail_id}`)
    })  
    .catch(error => {
      console.log(error)
      if(error.response.status === 401){
        setMessage(errorMessages.notAuthorized) 
        localStorage.clear()
        dispatchLoggedInUser({type:signinActions.LOGOUT})
    } else {    
        console.log('create biketrail error: else')
        setMessage(errorMessages.createFailure(error.response.data.error.message))
        history.push(`/biketrails/${biketrail_id}`)
    }
    //   setMessage('Some error occured during an attempt to delete an image!')
    //   history.push(`/biketrails/${biketrail_id}`)
    })
}

