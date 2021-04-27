import React,{useState,useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles'
import {Card, CardActions, CardContent, Typography} from '@material-ui/core';
import CommentMenu from './CommentMenu'
import CommentForm from './CommentForm';
import {SigninContext,MessageContext} from '../../context/biketrails.context'

const useStyles = makeStyles(theme => ({
    commentCard: {
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between',
        alignItems: 'space-between', // other-axix
        borderRadius: '3px',
        margin: '5px',
        paddingTop: '10px'
    },
    comment: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '3px'
    },
}))

export default function Comment(props){
    const {comment,biketrailId,setStatus} = props
    const classes = useStyles()
    const [selectCommentAction,setCommentAction] = useState(null)
    console.log(comment)
    const [loggedInUser,dispatchLoggedInUser] = useContext(SigninContext)
    const [message,setMessage] = useContext(MessageContext)
    return (
        <Card className={classes.commentCard}>
            {/* --------------------- EDIT COMMENT ------------------------------------*/}
            {selectCommentAction === 'Edit Comment' && <CommentForm 
                text={comment.text}
                biketrailId={biketrailId}
                commentId={comment._id}
                setStatus={setStatus}
                setCommentAction={setCommentAction}
                setMessage={setMessage}
            />}
            <CardContent>
                <Typography variant='h6'>{comment.author.userName}</Typography>
                <div className={comment}>
                    {!selectCommentAction && <Typography variant='h5'>{comment.text}</Typography>}
                    <Typography variant='h6'>{comment.createdAt}</Typography>
                </div>
            </CardContent>
            <CardActions>
                {loggedInUser && (comment.author.id === loggedInUser._id || loggedInUser.isAdmin) && <CommentMenu 
                    biketrailId={biketrailId}
                    commentId={comment._id}
                    selectCommentAction={selectCommentAction}
                    setCommentAction={setCommentAction}
                    setMessage={setMessage}
                    setStatus={setStatus}
                />}
            </CardActions>
        </Card>
    )
}