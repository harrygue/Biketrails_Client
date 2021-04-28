import {biketrailActions} from '../other/actionTypes'

export const allBiketrailReducer = (state,action) => {
    // console.log('biketrailReducer',state)
    switch(action.type){
        case biketrailActions.GETALLBIKETRAILS:
            return action.biketrails
        default:
            return state
    }
}