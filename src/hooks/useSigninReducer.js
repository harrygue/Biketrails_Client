import React,{createContext,useReducer,useState} from 'react'

const init = () => {
    return localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message
}

export const useSigninReducer = (reducer) => {
    const [state,dispatch] = useReducer(reducer,localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message)
    console.log('HIT useSigninReducer ',state)
    return [state,dispatch]
}