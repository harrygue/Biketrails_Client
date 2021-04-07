import * as api from '../api'


export const biketrailReducer = (state,action) => {
    console.log('biketrailReducer')
    switch(action.type){
        case 'GETBIKETRAIL':
            return null //{biketrail: useBiketrailState(id,status,setStatus)}
        case 'CREATEBIKETRAIL':
            console.log('CREATEBIKETRAIL:')
            createBiketrail(action.formData,action.setMessage,action.setOpen,action.setLoggedInUser,action.history)
            return {message:'Biketrail created'}
        case 'UPDATEBIKETRAIL':
            console.log(`UPDATEBIKETRAIL`)
            updateBiketrail(action.biketrailId,action.formData,action.setMessage,action.setStatus,action.setAction,action.setLoggedInUser,action.history)
            return {message:'Biketrail updated'}
        case 'DELETEBIKETRAIL':
            console.log(`DELETEBIKETRAIL`)
            deleteBikeTrail(action.id,action.setMessage,action.setLoggedInUser,action.history)
            return {message:'Biketrail deleted'}
        default:
            return state
    }
}

const createBiketrail = (data,setMessage,setOpen,setLoggedInUser,history) => {
    console.log('createBiketrail in biketrailReducer.js')
    api.createBikeTrail(data)
    .then(response => {
        if(response.status === 200){
            console.log(response.data.message)
            setMessage(response.data.message)  
            setOpen(false)
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
            }
        }
    })
}

const updateBiketrail = (id,data,setMessage,setStatus,setAction,setLoggedInUser,history) => {
    api.updateBikeTrail(id,data)
    .then(response => {
       if(response.status === 200){
           console.log(response.data)
           setStatus('success')
           setMessage(response.data.message)  
           setAction(null)
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
           }
       }
    })
}

const deleteBikeTrail = (id,setMessage,setLoggedInUser,history) => {
    api.deleteBikeTrail(id)
    .then(response => {
      console.log(JSON.stringify(response))
      if(response.status === 200){
        console.log(response.data.message)
        setMessage(response.data.message)
        history.push('/')
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
            }
        }
    })
}