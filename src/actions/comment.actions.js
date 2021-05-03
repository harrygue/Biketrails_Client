import {signinActions} from '../other/actionTypes'
import * as api from '../api'
import {successMessages,errorMessages} from '../other/messages'

// ----------------------- CREATE COMMENT ---------------------------
export const createComment = ( bt_id, data,setAction,setMessage,dispatchLoggedInUser) => {
    api.createComment(bt_id,{comment:data})
    .then(response => {
        if(response.status === 201){
            // console.log('Create Comment ',response.data)
            // setAction(null)
            setMessage(successMessages.createCommentOk)
        }
    })
    .catch(error => {
        if(error.response.status === 401){
            setMessage(errorMessages.notAuthorized)
            localStorage.clear()
            dispatchLoggedInUser({type:signinActions.LOGOUT})
        } else {
            setMessage('Ups, something went wrong, eventually you have to login again !')
        }
    })
}

// ------------------ UPDATE COMMENT -----------------------
export const updateComment = (bt_id,commentId,data,setCommentAction,setMessage,dispatchLoggedInUser) => {
    api.updateComment(bt_id,commentId,{'comment':data})
    .then(response => {
        if(response.status === 200){
            // console.log('Update Comment ',response.data)
            setCommentAction(null)
            setMessage(successMessages.updateCommentOk)
        }
    })
    .catch(error => {
        console.log(error)
        if(error.response.status === 401){
            setMessage(errorMessages.notAuthorized)
            localStorage.clear()
            dispatchLoggedInUser({type:signinActions.LOGOUT})
        } else {
            setMessage('Ups, something went wrong, eventually you have to login again !')
        }
    })
}

// ------------------ DELETE COMMENT -----------------------
export const deleteComment = (bt_id,commentId,setMessage,history,dispatchLoggedInUser) => {
    api.deleteComment(bt_id,commentId)
    .then(response => {
      if(response.status === 200){
        setMessage(successMessages.deleteCommentOk)
        history.push(`/biketrails/${bt_id}`)
      }
    })
    .catch(error => {
        if(error.response.status === 401){
            setMessage(errorMessages.notAuthorized)
            localStorage.clear()
            dispatchLoggedInUser({type:signinActions.LOGOUT})
        } else {
            setMessage('Ups, something went wrong, eventually you have to login again !')
            history.push('/')
        }
    })
}