import {signinActions} from '../other/actionTypes'

export const autoSignout = (dispatchLoggedInUser) => {
    localStorage.clear()
    dispatchLoggedInUser({type:signinActions.LOGOUT})
}