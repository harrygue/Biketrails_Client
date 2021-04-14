import {useState,useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import * as api from '../api'
import {errorMessages,successMessages} from '../other/messages'

// status, setStatus
export const useBiketrailState = (id,message,setMessage) => {
    const [biketrail,setBiketrail] = useState([])
    const history = useHistory()
    useEffect(() => {
        console.log('RUN USE BIKETRAIL EFFECT')
        const fetchBiketrail = async(id) => {
            try{
                const response = await api.getBikeTrail(id)
                if(response.status === 200){
                    console.log(response.data)
                    setBiketrail(response.data.biketrail)
                    console.log('inside use effect: Message',message)
                }
            } catch (error){
                console.log(error)
                setMessage(errorMessages.renderFailure(id))
                history.push('/')
            }
        }
        fetchBiketrail(id)
        // clean up function: 
        // this forces useEffect to run every time a new image is added
        // return () => {
        //     setStatus(null)
        //     console.log('useBiketrailState CALLBACK, Status: ',status)
        // }
    },[id,message])
    return [biketrail,setBiketrail]
}