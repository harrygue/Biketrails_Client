import React,{createContext,useReducer,useState} from 'react'
import {useAllBiketrailState} from '../hooks/useAllBiketrailState'
import {useBiketrailState} from '../hooks/useBiketrailState'
import {useLoggedInUser} from '../hooks/useLoggedInUser'
import * as api from '../api'
import {biketrailReducer} from '../reducers/biketrailReducer'
import {useBiketrailReducer} from '../hooks/useBiketrailReducer'

export const BiketrailsContext = createContext([[],() => {}]);
export const BiketrailContext = createContext([[],() => {}]);
export const LogginContext = createContext([[],() => {}])
export const MessageContext = createContext([[],() => {}])



//https://stackoverflow.com/questions/63381316/how-to-fix-react-context-typeerror-object-is-not-iterable-cannot-read-prope

export function BiketrailsProvider(props){
    // const [biketrail,setBiketrail] = useBiketrailState(id,status,setStatus)
    const [loggedInUser,setLoggedInUser] = useLoggedInUser()
    const [message,setMessage] = useState()
    const [biketrail,dispatch] = useBiketrailReducer(biketrailReducer)

    
    return(
        <BiketrailContext.Provider value={[biketrail,dispatch]}>
            <LogginContext.Provider value={[loggedInUser,setLoggedInUser]}>
                <MessageContext.Provider value={[message,setMessage]}>
                    {props.children}
                </MessageContext.Provider>
            </LogginContext.Provider>
        </BiketrailContext.Provider>
    )

}
