import {useState,useEffect} from 'react'
import * as api from '../api'

export const useAllBiketrailState = (message,setMessage) => {

    const [biketrails, setBiketrails] = useState()
    useEffect(() => {
        try{
            const fetchBiketrails = async() => {
                const response = await api.getBikeTrails()
                if(response.status === 200){
                    setBiketrails(response.data.biketrails)
                }
            }
            fetchBiketrails()
            // console.log("RUN USEEFFECT IN useAllBiketrailState")
            // console.log(message,biketrails)
        } catch(error){
            console.log(error)
        }
    },[message])


    return [biketrails,setBiketrails]
}