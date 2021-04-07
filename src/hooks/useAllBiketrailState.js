import {useState,useEffect} from 'react'
import * as api from '../api'

export const useAllBiketrailState = () => {

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
            console.log("RUN USEEFFECT IN useAllBiketrailState")
            console.log(biketrails)
        } catch(error){
            console.log(error)
        }
    },[])


    return [biketrails,setBiketrails]
}