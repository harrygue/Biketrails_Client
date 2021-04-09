import {useReducer} from 'react'


export const useCommentReducer =(reducer) => {
    const [state,dispatch] = useReducer(reducer,{})

    return [state,dispatch]
}