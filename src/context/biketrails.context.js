import React,{createContext,useState} from 'react'
import {useAllBiketrailState} from '../hooks/useAllBiketrailState'
import {useLoggedInUser} from '../hooks/useLoggedInUser'

export const BiketrailsContext = createContext([[],() => {}]);
export const LogginContext = createContext([[],() => {}])
export const MessageContext = createContext([[],() => {}])


//https://stackoverflow.com/questions/63381316/how-to-fix-react-context-typeerror-object-is-not-iterable-cannot-read-prope

export function BiketrailsProvider(props){
    const [biketrails] = useAllBiketrailState()
    const [loggedInUser,setLoggedInUser] = useLoggedInUser()
    const [message,setMessage] = useState()

    
    return(
        <BiketrailsContext.Provider value={biketrails}>
            <LogginContext.Provider value={[loggedInUser,setLoggedInUser]}>
                <MessageContext.Provider value={[message,setMessage]}>
                    {props.children}
                </MessageContext.Provider>
            </LogginContext.Provider>
        </BiketrailsContext.Provider>
    )

}
