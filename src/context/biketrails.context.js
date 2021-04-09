import React,{createContext,useReducer,useState} from 'react'
import {useAllBiketrailState} from '../hooks/useAllBiketrailState'
import {useBiketrailState} from '../hooks/useBiketrailState'
import {useLoggedInUser} from '../hooks/useLoggedInUser'
import * as api from '../api'
import {biketrailReducer} from '../reducers/biketrailReducer'
import {useBiketrailReducer} from '../hooks/useBiketrailReducer'
import {commentReducer} from '../reducers/commentReducer'
import {useCommentReducer} from '../hooks/useCommentReducer'

export const BiketrailsContext = createContext([[],() => {}]);
export const BiketrailContext = createContext([[],() => {}]);
export const CommentContext = createContext([[],() => {}]);
export const LogginContext = createContext([[],() => {}])
export const MessageContext = createContext([[],() => {}])



//https://stackoverflow.com/questions/63381316/how-to-fix-react-context-typeerror-object-is-not-iterable-cannot-read-prope

export function BiketrailsProvider(props){
    // const [biketrail,setBiketrail] = useBiketrailState(id,status,setStatus)
    const [loggedInUser,setLoggedInUser] = useLoggedInUser()
    const [message,setMessage] = useState()
    const [biketrail,dispatch] = useBiketrailReducer(biketrailReducer)
    const [comment,dispatchComment] = useCommentReducer(commentReducer)

    
    return(
        <BiketrailContext.Provider value={[biketrail,dispatch]}>
            <CommentContext.Provider value={[comment,dispatchComment]}>
                <LogginContext.Provider value={[loggedInUser,setLoggedInUser]}>
                    <MessageContext.Provider value={[message,setMessage]}>
                        {props.children}
                    </MessageContext.Provider>
                </LogginContext.Provider>
            </CommentContext.Provider>
        </BiketrailContext.Provider>
    )

}
