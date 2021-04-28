import {biketrailActions} from '../other/actionTypes'



export const biketrailReducer = (state,action) => {
    // console.log('biketrailReducer',state)
    switch(action.type){
        case biketrailActions.GETBYID:
            return action.biketrail
        default:
            return state
    }
}
