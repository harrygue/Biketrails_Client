import React,{useState,useContext, useEffect} from 'react';

import Comment from '../Comments/Comment';
import CommentForm from '../Comments/CommentForm';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import {Card, CardActions, CardContent, Collapse, Grid, Typography} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import EditBiketrailForm from './EditBiketrailForm'
import BiketrailMenu from './BiketrailMenu'
import {MemoizedImageSlider} from '../images/ImageSlider'
import ImageForm from '../images/ImageForm'
import {PlotMapLeaflet} from '../Plots'
import {BiketrailContext,MessageContext,SigninContext} from '../../context/biketrails.context'
import Message from '../Message'
import {useHistory} from 'react-router-dom'
import {fetchBiketrailById,updateBTlikes} from '../../actions/biketrail.actions'
import {Spinner} from '../Spinner'
import Moment from 'react-moment';

const useStyles = makeStyles(theme =>({
    root: {
        // maxWidth: 645,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between', // main-axix
        borderRadius: '5px',
    },
    imageCard: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boderRadius: '5px',
        margin: '5px'
    },
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
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
        margin: '5px',
        
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
          duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    sideContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '10px'
    }
}))

export default function BikeTrail(props){
    const {id} = props.match.params;
    const [status,setStatus] = useState(null)
    const classes = useStyles();
    const [message,setMessage] = useContext(MessageContext)
    const history = useHistory()
    const [biketrail,dispatchBiketrail] = useContext(BiketrailContext)
    const [expanded, setExpanded] = useState(false);
    const [selectAction,setAction] = useState(null)
    const [loggedInUser,dispatchLoggedInUser] = useContext(SigninContext)

    useEffect(() => {
        fetchBiketrailById(id,dispatchBiketrail,setMessage,history)
        // cleanup function to return to biketrail after edit
        return () => { setAction(null) }
    },[message])

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    // need to be logged in to like
    // can only like for others trails or comments
    // can only give one like
    const handleLikes = (e) => {
        e.preventDefault()
        console.log(JSON.parse(localStorage.getItem('profile')).message._id)
        console.log(biketrail.author.id)
        if (localStorage.getItem('profile') && biketrail.author.id !== JSON.parse(localStorage.getItem('profile')).message._id &&  !biketrail.likesUserIds.includes(JSON.parse(localStorage.getItem('profile')).message._id)){
            const newLikes = biketrail.likes ? biketrail.likes+1 : 1
            const userId = JSON.parse(localStorage.getItem('profile')).message._id
            updateBTlikes(id,{newLikes,userId},setMessage,dispatchLoggedInUser)
        }
    }

    return (
        <>
        {biketrail ? <Grid container className={classes.root}>
            { selectAction !== 'Edit' ?
            <>
            <Message />
            <Grid item xs={12} sm={4}>
                <Card className={classes.sideContainer}>
                    <Typography variant='h5'>{biketrail.name}</Typography>
                    {biketrail && biketrail.gpxFileName !== '' && <PlotMapLeaflet gpxFile={biketrail.gpxFile} gpxFileName={biketrail.gpxFileName} lat={biketrail.lat} lng={biketrail.lng}/>}
                </Card>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Card className={classes.imageCard}>
                    {biketrail.images && biketrail.images.length >0 ? <MemoizedImageSlider biketrail_id={id} images={biketrail.images}/> : <Spinner />}
                    <CardContent>
                        <Typography variant='h4'>{biketrail.name}</Typography>
                        <Typography variant='body2'>{biketrail.description}</Typography>
                        <span variant='body2'>from {biketrail.author.userName}, </span>
                        <Moment fromNow>{biketrail.createdAt}</Moment>
                    </CardContent>
                    <CardActions>
                        <IconButton aria-label="add to favorites">
                           <FavoriteIcon onClick={handleLikes}/>
                           <Typography variant='body2'>{biketrail && biketrail.likes}</Typography>
                        </IconButton>
                        <IconButton aria-label="share">
                           <ShareIcon />
                        </IconButton>
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label="show more"
                        >
                            <ExpandMoreIcon />
                        </IconButton>

                        
                        {/* only show menu if user is authorized */
                        loggedInUser && biketrail.author && (loggedInUser._id === biketrail.author.id || loggedInUser.isAdmin) && <BiketrailMenu id={id} 
                            selectAction={selectAction} setAction={setAction}
                        />}
                        {selectAction === 'Delete' && props.history.push('/biketrails')}
                        
                    </CardActions>

                    {selectAction === 'Create Comment' && <CommentForm setAction={setAction} biketrailId={id} setStatus={setStatus}/>}
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        
                        <Typography variant='h5' style={{marginLeft: '10px'}}>Comments</Typography>
                        {biketrail.comments && biketrail.comments.length>0 ? biketrail.comments.map(comment => 
                        <Comment
                            key={comment._id}
                            comment={comment}
                            biketrailId={id}
                            setStatus={setStatus}
                        />
                        ) : <Typography variant='h2' styles={{color:'blue'}}>Looks pretty empty here !</Typography>}
                    </Collapse>* 
                </Card>
                {selectAction === 'Add Image' && <ImageForm id={id} setAction={setAction} setStatus={setStatus}/>}
            </Grid> 
            </>  :  <EditBiketrailForm 
                        id={id} 
                        name={biketrail.name} 
                        description={biketrail.description} 
                        location={biketrail.location}
                        category={biketrail.category}
                        gpxFileName={biketrail.gpxFileName}
                        existingGpxFile={biketrail.gpxFile}
                        setAction={setAction}
                    />
        }
        </Grid> : <Spinner />}
        </>
    )
}
