import {useReducer} from 'react'

export const useSigninReducer = (reducer) => {
    const [state,dispatch] = useReducer(reducer,localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message)
    // console.log('HIT useSigninReducer ',state)
    return [state,dispatch]
}