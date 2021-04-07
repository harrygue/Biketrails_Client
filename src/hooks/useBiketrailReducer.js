import React,{createContext,useReducer,useState} from 'react'


export const useBiketrailReducer =(reducer) => {
    const [state,dispatch] = useReducer(reducer,{})

    return [state,dispatch]
}