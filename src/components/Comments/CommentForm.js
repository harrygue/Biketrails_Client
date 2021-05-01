import React,{useContext, useState} from 'react'
import {makeStyles} from '@material-ui/core/styles'
import {Card,CardContent,TextField,Button,Typography} from '@material-ui/core'
import {MessageContext,SigninContext} from '../../context/biketrails.context'
import {createComment, updateComment} from '../../actions/comment.actions'


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
    const {biketrailId,commentId=null,setAction,setCommentAction,text='write a comment'} = props;
    const [commentData,setCommentData] = useState(text)
    const [message,setMessage] = useContext(MessageContext)
    const [loggedInUser,dispatchLoggedInUser] = useContext(SigninContext)

    const handleChange = (e) => {
        setCommentData(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        !commentId ? 
        createComment(biketrailId,commentData,setAction,setMessage,dispatchLoggedInUser) : 
        updateComment(biketrailId,commentId,commentData,setCommentAction,setMessage,dispatchLoggedInUser)
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
                    {commentId ? 'Update' : 'Create'}
                </Button>
            </form>
            </CardContent>
        </Card>
    )
}