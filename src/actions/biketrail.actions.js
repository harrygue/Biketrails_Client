import {biketrailActions} from '../other/actionTypes'
import * as api from '../api'


export const fetchBiketrails = async(dispatch,message,history) => {
    try{
        const response = await api.getBikeTrails()
        if(response.status === 200){
            // setBiketrails(response.data.biketrails)
            
            dispatch({type:biketrailActions.GETALLBIKETRAILS,biketrails:response.data.biketrails})
        }
    } catch(error){
        console.log(error)
        history.push('/')
    }
}