import {useState} from 'react'

export const useTogglePlot = (params) => {
    const [plotSize,setPlotSize] = useState(params)
    setToggle(!toggle)
    return [plotSize,setPlotSize]
}