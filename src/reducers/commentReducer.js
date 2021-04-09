import * as api from '../api'

export const commentReducer = (state,action) => {
    switch(action.type){
        case 'GETALLCOMMENTS':
            getAllComments()
            return state
        case 'GETCOMMENT':
            const comment = getComment(action.id)
            return state
        case 'CREATECOMMENT':
            createComment(action.biketrailId,action.commentData,action.setAction,action.setMessage,action.setLoggedInUser,action.history)
            return null
        case 'UPDATECOMMENT':
            updateComment(action.biketrailId,action.commentId,action.commentData,action.setCommentAction,action.setMessage,action.setLoggedInUser,action.history)
            return null
        case 'DELETECOMMENT':
            deleteComment(action.biketrailId,action.commentId,action.setMessage,action.setLoggedInUser,action.history)
            return null
    }
}

const getAllComments = () => {

}

const getComment = (id) => {

}

// ----------------------- CREATE COMMENT ---------------------------
const createComment = ( bt_id, data,setAction,setMessage,setLoggedInUser,history) => {
    api.createComment(bt_id,{comment:data})
    .then(response => {
        if(response.status === 201){
            console.log('Create Comment ',response.data)
            setAction(null)
            setMessage(response.data.message)
        }
    })
    .catch(err => {
        if(err.response){
            console.log(err.response.data)
            if(err.response.data.name === "TokenExpiredError"){
                setLoggedInUser(false)
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

// ------------------ UPDATE COMMENT -----------------------
const updateComment = (bt_id,commentId,data,setCommentAction,setMessage,setLoggedInUser,history) => {

    api.updateComment(bt_id,commentId,{'comment':data})
    .then(response => {
        if(response.status === 200){
            console.log('Update Comment ',response.data)
            setCommentAction(null)
            setMessage(response.data.message)
        }
    })
    .catch(err => {
        if(err.response){
            console.log(err.response.data)
            if(err.response.data.name === "TokenExpiredError"){
                setLoggedInUser(false)
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

// ------------------ DELETE COMMENT -----------------------
const deleteComment = (bt_id,commentId,setMessage,setLoggedInUser,history) => {
    api.deleteComment(bt_id,commentId)
    .then(response => {
      console.log(JSON.stringify(response))
      if(response.status === 201){
        console.log(response.data)
        setMessage(response.data.message)
        history.push(`/biketrails/${bt_id}`)
      }
    })
    .catch(err => {
        if(err.response){
            console.log(err.response.data)
            if(err.response.data.name === "TokenExpiredError"){
                setLoggedInUser(false)
                localStorage.clear()
                setMessage('Your session expired, please login again !')
                history.push(`/biketrails/${bt_id}`)
            } else {
                setMessage('Ups, something went wrong !')
                history.push(`/biketrails/${bt_id}`)
            }
        }
    })
}

