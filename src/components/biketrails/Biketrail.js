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
import {useBiketrailState} from '../../hooks/useBiketrailState'
import {MemoizedImageSlider} from '../images/ImageSlider'
import ImageForm from '../images/ImageForm'
import {PlotMapLeaflet} from '../Plots'
import {LogginContext,MessageContext,BiketrailContext} from '../../context/biketrails.context'
import Message from '../Message'


const useStyles = makeStyles(theme =>({
    root: {
        // maxWidth: 645,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between', // main-axix
        borderRadius: '5px',
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
    // const {message,setMessage} = props;
    const [status,setStatus] = useState(null)
    const classes = useStyles();
    const [message,setMessage] = useContext(MessageContext)

    // const [biketrail,dispatch] = useContext(BiketrailContext)
    const [biketrail,setBiketrail] = useBiketrailState(id,status,setStatus)
    const [expanded, setExpanded] = useState(false);
    const [selectAction,setAction] = useState(null)
    const [loggedInUser,setLoggedInUser] = useContext(LogginContext)

    console.log('RENDER biketrail id: ',id)
    // console.log('biketrail.author.id',biketrail.author && biketrail.author.id)
    // console.log('logged user id: ',loggedInUser && loggedInUser._id)
    // console.log(biketrail.images)
    // console.log(biketrail.comments)
    setMessage('')
    console.log('MESSAGE: ',message)
    // console.log('GPX Filename: ',biketrail.gpxFileName)

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    return (
        
        <Grid container className={classes.mainContainer}>
            { selectAction !== 'Edit' ?
            <>
            <Message />
            <Grid item xs={12} sm={4}>
                <Card className={classes.sideContainer}>
                    <Typography variant='h5'>{biketrail.name}</Typography>
                    {biketrail && biketrail.gpxFile && <PlotMapLeaflet gpxFile={biketrail.gpxFile} gpxFileName={biketrail.gpxFileName} lat={biketrail.lat} lng={biketrail.lng}/>}
                </Card>
            </Grid>
            <Grid item xs={12} sm={8}>
                <Card className={classes.root}>
                    {biketrail.images && biketrail.images.length >0 && <MemoizedImageSlider images={biketrail.images}/>}
                    <CardContent>
                        <Typography variant='h4'>{biketrail.name}</Typography>
                        <Typography variant='body2'>{biketrail.description}</Typography>
                    </CardContent>
                    <CardActions>
                        <IconButton aria-label="add to favorites">
                           <FavoriteIcon />
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
                    </Collapse>
                </Card>
                {selectAction === 'Add Image' && <ImageForm id={id} setAction={setAction} setStatus={setStatus}/>}
            </Grid> 
            </>  :  <EditBiketrailForm 
                        biketrailId={id} 
                        name={biketrail.name} 
                        description={biketrail.description} 
                        location={biketrail.location}
                        category={biketrail.category}
                        gpxFileName={biketrail.gpxFileName}
                        existingGpxFile={biketrail.gpxFile}
                        setAction={setAction}
                        status={status}
                        setStatus={setStatus}
                    />
        }
        </Grid>
    )
}

// export const MemoizedBiketrail = React.memo(BikeTrail)

