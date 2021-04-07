import {useState,useEffect} from 'react'

export const useLoggedInUser = () => {
    const [loggedInUser,setLoggedInUser] = useState()
    useEffect(() => {
        setLoggedInUser(localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message)
    },[])
    return [loggedInUser,setLoggedInUser]
}