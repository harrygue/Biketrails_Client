import React,{createContext,useReducer,useState} from 'react'


export const useSigninReducer =(reducer) => {
    const [state,dispatch] = useReducer(reducer,localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).message : null)

    return [state,dispatch]
}