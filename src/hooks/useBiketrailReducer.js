import React,{createContext,useReducer,useState} from 'react'

import * as api from '../api'

export const useBiketrailReducer =(reducer) => {
    const [state,dispatch] = useReducer(reducer)
    return [state,dispatch]
}