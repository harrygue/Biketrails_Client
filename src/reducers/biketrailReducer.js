import * as api from '../api'


export const biketrailReducer = (state,action) => {
    console.log('biketrailReducer')
    switch(action.type){
        case 'GETBIKETRAIL':
            return null //{biketrail: useBiketrailState(id,status,setStatus)}
        case 'CREATEBIKETRAIL':
            console.log('CREATEBIKETRAIL:',action.formData)
            createBiketrail(action.formData,action.setMessage,action.setOpen,action.setLoggedInUser,action.history)
            return {message:'Biketrail created'}
        case 'UPDATEBIKETRAIL':
            console.log(action.payload)
            return {TEST:action.payload}
        case 'DELETEBIKETRAIL':
            return null
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