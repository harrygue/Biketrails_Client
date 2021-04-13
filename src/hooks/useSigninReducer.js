import React,{createContext,useReducer,useState} from 'react'


export const useSigninReducer = (reducer) => {
    console.log('HIT useSigninReducer')
    const [state,dispatch] = useReducer(reducer,localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message)

    return [state,dispatch]
}