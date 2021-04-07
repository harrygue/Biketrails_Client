import React,{useState} from 'react'
import * as apiauth from '../../api/auth'
import {makeStyles} from '@material-ui/core/styles'
import {Card,CardContent,TextField,Button,Typography} from '@material-ui/core'
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {useHistory} from 'react-router-dom'

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

export default function Register (props){
    const classes = useStyles()
    const history = useHistory()
    const [user,setUser] = useState({
        username:'',
        password:''
    })
    const [show,setShow] = useState(true)
    

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
        console.log('hit Register handleSubmit')
        console.log(user)
        apiauth.register(user)
        .then(response => {
            if(response.status === 200){
                console.log(response.status, response.data)
                localStorage.setItem('profile',JSON.stringify(response.data))
                history.push('/')
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    return(
        <Card>
            <CardContent>
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
                    Register
                </Button>
                </form>
            </CardContent>
        </Card>
    )
}