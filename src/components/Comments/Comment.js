import React,{useState,useContext} from 'react';
import {makeStyles} from '@material-ui/core/styles'
import {Card, CardActions, CardContent, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import CommentMenu from './CommentMenu'
import CommentForm from './CommentForm';
import {SigninContext,MessageContext} from '../../context/biketrails.context'
import {updateCommentLikes} from '../../actions/comment.actions'
import Moment from 'react-moment';


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
    const [loggedInUser,dispatchLoggedInUser] = useContext(SigninContext)
    const [message,setMessage] = useContext(MessageContext)
    // console.log(loggedInUser)
    // console.log(loggedInUser._id)
    // console.log(comment.author.id)

    const handleLikes = (e) => {
        e.preventDefault()
        // console.log(JSON.parse(localStorage.getItem('profile')).message._id)
        // console.log(comment.author.id)
        if (localStorage.getItem('profile') && comment.author.id !== JSON.parse(localStorage.getItem('profile')).message._id &&  !comment.likesUserIds.includes(JSON.parse(localStorage.getItem('profile')).message._id)){
            const newLikes = comment.likes ? comment.likes+1 : 1
            const userId = JSON.parse(localStorage.getItem('profile')).message._id
            updateCommentLikes(biketrailId,comment._id,{newLikes,userId},setMessage,dispatchLoggedInUser)
        }
    }

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
                    {!selectCommentAction && <Typography variant='h6'>{comment.text}</Typography>}
                    <Moment fromNow>{comment.createdAt}</Moment>
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
                <IconButton aria-label="add to favorites">
                   <FavoriteIcon onClick={handleLikes}/>
                   <Typography variant='body2'>{comment && comment.likes}</Typography>
                </IconButton>
            </CardActions>
        </Card>
    )
}