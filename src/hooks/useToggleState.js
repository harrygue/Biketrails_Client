import {useState} from 'react'

export const useToggleState = (state) => {
    const [toggle,setToggle] = useState(state)
    setToggle(!toggle)
    return [toggle,setToggle]
}