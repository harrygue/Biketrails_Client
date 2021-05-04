import React,{useState,useContext} from 'react'
import {Card, CardContent, Typography,TextField, Button} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {useHistory} from 'react-router-dom'
import {MessageContext,SigninContext} from '../../context/biketrails.context.js'
import {createImage} from '../../actions/image.actions'


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

export default function ImageForm({id}){
    const classes = useStyles()
    const history = useHistory()
    const [image,setImage] = useState(null)
    const [location,setLocation] = useState("")
    const [message,setMessage] = useContext(MessageContext)
    const [loggedInUser,dispatchLoggedInUser] = useContext(SigninContext)
    const [errorText,setErrorText] = useState(null)

    const handleValidation = (field) => {
        let fieldIsValid = true
        let errors = {}
        setErrorText(null)
        console.log(field)

        if(!field.match(/^[a-zA-Z0-9\s]*$/)){
            errors['location'] = 'only letters and numbers allowed!'
            fieldIsValid = false
            setErrorText(errors)
        }
        
        return fieldIsValid
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('location',location)
        formData.append('image',image)
        handleValidation(location) && createImage(id,formData,setMessage,history,dispatchLoggedInUser)
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
                        error={errorText && errorText['location'] ? true : false}
                        helperText={errorText && errorText['location']}
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