import React,{useContext} from 'react'
import {Grid,Typography} from '@material-ui/core'
import {MessageContext} from '../context/biketrails.context'
import { v4 as uuidv4 } from 'uuid';
import {useHistory} from 'react-router-dom'
import {settings} from '../other/setting'

export default function Message(){
    const history = useHistory()
    const [message,setMessage] = useContext(MessageContext);
    console.log('Render Message: ',message)
    return (
        <Grid item xs={12} sm={12} key={uuidv4()}>
          {message && <Typography variant='h3' style={{color:'green'}}>{message}</Typography>}
          {message && setTimeout(() => {
              setMessage(null)
            },settings.messageTimeout)}
        </Grid>
    )
}