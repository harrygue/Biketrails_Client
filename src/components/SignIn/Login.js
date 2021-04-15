import React,{useState,useContext,useEffect} from 'react'
import * as apiauth from '../../api/auth'
import {makeStyles} from '@material-ui/core/styles'
import {Card,CardContent,TextField,Button,Typography} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {useHistory} from 'react-router-dom'
import {LogginContext,MessageContext,SigninContext} from '../../context/biketrails.context' //
import Message from '../Message'
import {useToggleState} from '../../hooks/useToggleState'

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
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    buttonSubmit: {
        marginBottom: 10,
    },
}))

export default function Login (props){
    const classes = useStyles()
    const history = useHistory()
    // const [loggedInUser,setLoggedInUser] = useContext(LogginContext)
    const [loggedInUser,dispatch] = useContext(SigninContext)
    const [message,setMessage] = useContext(MessageContext)
    const [user,setUser] = useState({
        username:'',
        password:''
    })

    const [open,setOpen] = useState(true)

    console.log('Login open ? ',open)

    const [show,setShow] = useState(false)

    const toggleShow = () => {
        setShow(!show)
    }

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };

    const handleChange = e => {
        setUser({...user,[e.target.name]:e.target.value})
    }

    const handleSubmit = e => {
        e.preventDefault()
        console.log('hit handleSubmit')
        console.log(user)
        console.log(message)
        dispatch({type:'LOGIN',user,setMessage,setOpen})
        console.log(loggedInUser)
        // apiauth.login(user)
        // .then(response => {
        //     if(response.status === 200){
        //         console.log(response.data)
        //         localStorage.setItem('profile',JSON.stringify(response.data))
        //         setLoggedInUser(localStorage.getItem('profile') && JSON.parse(localStorage.getItem('profile')).message)
        //         setMessage(`Hello ${response.data.message.username}! Welcome back again !`)
        //         history.push('/')
        //     }
        // })
        // .catch(error => {
        //     console.log(error)
        // })
    }

    return (
        <Card>
            <Message />
            {open ? <CardContent>
                <form
                    encType="multipart/form-data"
                    autoComplete='off'
                    noValidate
                    className={`${classes.root} ${classes.form}`}
                >
                    <Typography variant='h5'></Typography>
                    <TextField 
                        required
                        name='username'
                        label='User Name'
                        variant='outlined'
                        fullWidth
                        value={user.username}
                        onChange={handleChange}
                    />
                    <TextField 
                        required
                        name='password'
                        label='Password'
                        type={show ? 'text' : 'password'}
                        variant='outlined'
                        fullWidth
                        value={user.password}
                        onChange={handleChange}
                        InputProps={{
                            endAdornment: <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle password visibility"
                                onClick={toggleShow}
                                onMouseDown={handleMouseDownPassword}
                              >
                                {show ? <Visibility /> : <VisibilityOff />}
                              </IconButton>
                            </InputAdornment>
                        }}
                    />

                    <Button
                    className={classes.buttonSubmit}
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                >
                    Login
                </Button>
                </form>
            </CardContent> : history.push('/')}
        </Card>
    )
}