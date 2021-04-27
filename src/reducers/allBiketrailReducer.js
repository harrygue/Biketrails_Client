import {biketrailActions, imageActions} from '../other/actionTypes'

export const allBiketrailReducer = (state,action) => {
    console.log('biketrailReducer',state)
    switch(action.type){
        case biketrailActions.GETALLBIKETRAILS:
            console.log(action.biketrails)
            return action.biketrails
        default:
            return state
    }
}