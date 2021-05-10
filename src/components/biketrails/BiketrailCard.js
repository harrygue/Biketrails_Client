import React from 'react'
import {Card,CardActions,CardContent,CardMedia,Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import {Link} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles(theme => ({
    media: {
        height: 0,
        paddingTop: '56.25%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backgroundBlendMode: 'darken',
    },
    border: {
      border: 'solid',
    },
    fullHeightCard: {
      height: '100%',
    },
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '15px',
      height: '100%',
      position: 'relative',
    },
    overlay: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      color: 'white',
    },
    overlay2: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      color: 'white',
    },
    grid: {
      display: 'flex',
    },
    details: {
      display: 'flex',
      justifyContent: 'space-between',
      margin: '20px',
    },
    title: {
      padding: '0 16px',
    },
    cardActions: {
      padding: '0 16px 8px 16px',
      display: 'flex',
      justifyContent: 'space-between',
    },
}))

const SportIcon = ({category}) => {
  let no = null
  const icons = [DirectionsBikeIcon,DirectionsRunIcon,DirectionsWalkIcon]
  switch(category){
    case 'Mountain Bike':
      no = 0;
      break;
    case 'Road Bike / Strassenrad':
      no = 0;
      break;
    case 'Hike / Wanderung':
      no = 2;
      break;
    case 'Jogging':
      no = 1;
      break;
    default:
      no = 2;
      break
  }
  return (
    <>
      {no === 0 && < DirectionsBikeIcon/>}
      {no === 1 && < DirectionsRunIcon/>}
      {no === 2 && < DirectionsWalkIcon />}
    </>
  )
}

export default function BikeTrailCard(props){
    const {name,id,author,createdAt,description,image,category} = props;
    const classes = useStyles();
    // console.log('RENDER BIKETRAIL CARD ',id)

    return (
        <Card key={uuidv4()} className={classes.card}>
            <CardMedia 
                className={classes.media}
                image={image ? image : ""}
            />
            {/*<div className={classes.overlay}>
                <Typography variant='h6'>{author}</Typography>
                <Typography variant='body2'>{createdAt}</Typography>
            </div>*/}
            <div className={classes.overlay2}>
                <Link to={`/biketrails/${id}` } style={{color: 'white'}} ><SportIcon fontSize='default' category={category}/></Link>
            </div>
            <Typography className={classes.title}  variant='h5' gutterBottom>{name}</Typography>
            <CardContent>
                <Typography>{name}</Typography>
            </CardContent>
            <CardActions>

            </CardActions>
        </Card>
    )
}