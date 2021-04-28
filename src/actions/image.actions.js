import * as api from '../api'
import {successMessages,errorMessages} from '../other/messages'

export const createImage = (biketrailId,formData,setMessage,history) => {
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
            } else {
                console.log('create biketrail error: else')
                setMessage(errorMessages.createFailure(err.response.data.error.message))
            }
            history.push('/')
        })
}

export const deleteImage = (biketrail_id,imageId,setMessage,history) => {
    api.deleteImage(biketrail_id,imageId)
    .then(response => {
      console.log(response)
      setMessage('Image deleted!')
      history.push(`/biketrails/${biketrail_id}`)
    })
    .catch(error => {
      console.log(error)
      setMessage('Some error occured during an attempt to delete an image!')
      history.push(`/biketrails/${biketrail_id}`)
    })
}

