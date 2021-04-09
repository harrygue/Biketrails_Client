import React,{useContext, useState} from 'react'
import {useHistory} from 'react-router-dom'
import * as api from '../../api'
import {makeStyles} from '@material-ui/core/styles'
import {Card,CardContent,TextField,Button,Typography} from '@material-ui/core'
import {CommentContext,MessageContext,LogginContext} from '../../context/biketrails.context'


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

export default function CommentForm(props){
    const classes = useStyles()
    const history = useHistory()
    const {biketrailId,commentId=null,setAction,setCommentAction,setStatus,text='write a comment'} = props;
    const [commentData,setCommentData] = useState(text)
    const [comment,dispatch] = useContext(CommentContext)
    const [message,setMessage] = useContext(MessageContext)
    const [loggedInUser,setLoggedInUser] = useContext(LogginContext)

    const handleChange = (e) => {
        setCommentData(e.target.value)
    }

    const handleSubmit = (e) => {
        console.log('hit handleSubmit')
        console.log(commentData)
        e.preventDefault()

        commentId ? 
            dispatch({type:'UPDATECOMMENT',biketrailId,commentId,commentData,setCommentAction,setMessage,setLoggedInUser,history}) : 
            dispatch({type:'CREATECOMMENT',biketrailId,commentData,setAction,setMessage,setLoggedInUser,history})
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
                <Typography variant='h6'>{commentId ? 'Edit' : 'Create'} a Comment</Typography>
                <TextField
                    name='comment'
                    label='New Comment'
                    variant='outlined'
                    fullWidth
                    value={commentData}
                    onChange={handleChange}
                />
                <Button
                    className={classes.buttonSubmit}
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                >
                    Create
                </Button>
            </form>
            </CardContent>
        </Card>
    )
}