import {useState,useEffect} from 'react'
import * as api from '../api'

// status, setStatus
export const useBiketrailState = (id,message) => {
    const [biketrail,setBiketrail] = useState([])
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