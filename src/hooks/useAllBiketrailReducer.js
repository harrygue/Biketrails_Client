import {useReducer} from 'react'

export const useAllBiketrailReducer =(reducer) => {
    const [state,dispatch] = useReducer(reducer)
    return [state,dispatch]
}