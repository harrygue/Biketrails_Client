import React,{useState,useContext} from 'react'
import {Card, CardContent, Typography,TextField, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import * as api from '../../api'
import {useHistory} from 'react-router-dom'
import {LogginContext,MessageContext} from '../../context/biketrails.context.js'


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
        },
    },
    paper: {
      padding: theme.spacing(2),
    },
    form: {
        display: 'flex',
        flexDirection:'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fileInput: {
        width: '97%',
        margin: '10px 0',
    },
    buttonSubmit: {
        width: '97%',
        margin: '10px 0',
        marginBottom: 10,
    },
}))

export default function ImageForm({id,setAction,setStatus}){
    const classes = useStyles()
    const history = useHistory()
    const [image,setImage] = useState(null)
    const [location,setLocation] = useState("")
    const [loggedInUser,setLoggedInUser] = useContext(LogginContext)
    const [message,setMessage] = useContext(MessageContext)



    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('location',location)
        formData.append('image',image)

        api.createImage(id,formData)
        .then(response => {
            if(response.status === 201){
                console.log(response.status)
                setMessage(response.data.message)
                setAction(null)
                setStatus("success")
            }
        })
        .catch(err => {
            if(err.response){
                console.log(err.response.data)
                if(err.response.data.name === "TokenExpiredError"){
                    setLoggedInUser(false)
                    localStorage.clear()
                    setMessage('Your session expired, please login again !')
                    history.push('/')
                }
            }
        })
    }



    return (
        <Card>
            <CardContent>
                <form
                    encType="multipart/form-data"
                    autoComplete='off'
                    noValidate 
                    className={`${classes.root} ${classes.form}`}
                    onSubmit={handleSubmit}
                >
                <Typography variant='h6'>Add an Image</Typography>
                    <TextField 
                        name='location'
                        label='Image Title'    
                        variant='outlined'
                        fullWidth
                        value={location}
                        onChange={evt => {setLocation(evt.target.value)}}
                    />
                    {/* file input */}
                    <input
                        style={{ display: "none" }}
                        id="contained-button-file"
                        type="file"
                        name='image'
                        accept="jpg/*"
                        onChange={evt => {setImage(evt.target.files[0])}}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="secondary" component="span">
                            Image Upload
                        </Button>
                    </label>
                    <Button
                        className={classes.buttonSubmit}
                        variant='contained'
                        type='submit'
                        color='primary'
                        size='large'
                    >
                        Submit
                    </Button>
                </form>
            </CardContent>
        </Card>
        
    )
}