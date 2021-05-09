import React,{createContext,useState} from 'react'
import {biketrailReducer} from '../reducers/biketrailReducer'
import {useBiketrailReducer} from '../hooks/useBiketrailReducer'
import {allBiketrailReducer} from '../reducers/allBiketrailReducer'
import {useAllBiketrailReducer} from '../hooks/useAllBiketrailReducer'
import {commentReducer} from '../reducers/commentReducer'
import {useCommentReducer} from '../hooks/useCommentReducer'
import {signinReducer} from '../reducers/signinReducer'
import {useSigninReducer} from '../hooks/useSigninReducer'

export const AllBiketrailsContext = createContext([[],() => {}]);
export const BiketrailContext = createContext([[],() => {}]);
export const CommentContext = createContext([[],() => {}]);
export const LogginContext = createContext([[],() => {}])
export const MessageContext = createContext([[],() => {}])
export const SigninContext = createContext([[],() => {}])


//https://stackoverflow.com/questions/63381316/how-to-fix-react-context-typeerror-object-is-not-iterable-cannot-read-prope

export function BiketrailsProvider(props){
    const [message,setMessage] = useState()
    const [allBiketrails,dispatchAllBiketrails] = useAllBiketrailReducer(allBiketrailReducer)
    const [biketrail,dispatchBiketrail] = useBiketrailReducer(biketrailReducer)
    const [comment,dispatchComment] = useCommentReducer(commentReducer)
    const [loggedInUser,dispatchLoggedInUser] = useSigninReducer(signinReducer)

    
    return(
        <AllBiketrailsContext.Provider value={[allBiketrails,dispatchAllBiketrails]}>
            <BiketrailContext.Provider value={[biketrail,dispatchBiketrail]}>
                <CommentContext.Provider value={[comment,dispatchComment]}>
                    <SigninContext.Provider value={[loggedInUser,dispatchLoggedInUser]}>
                        <MessageContext.Provider value={[message,setMessage]}>
                            {props.children}
                        </MessageContext.Provider>
                    </SigninContext.Provider>
                </CommentContext.Provider>
            </BiketrailContext.Provider>
        </AllBiketrailsContext.Provider>
    )

}

