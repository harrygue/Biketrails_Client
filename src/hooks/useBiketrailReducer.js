import React,{useReducer} from 'react'

export const useBiketrailReducer =(reducer) => {
    const [state,dispatch] = useReducer(reducer)
    return [state,dispatch]
}