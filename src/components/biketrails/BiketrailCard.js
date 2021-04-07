import React from 'react'
import {Card,CardActions,CardContent,CardMedia,Typography} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import DirectionsBikeIcon from '@material-ui/icons/DirectionsBike';
import {Link} from 'react-router-dom'

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

export default function BikeTrailCard(props){
    const {name,id,author,createdAt,description,image} = props;
    const classes = useStyles();

    return (
        <Card className={classes.card}>
            <CardMedia 
                className={classes.media}
                image={image ? image : ""}
            />
            <div className={classes.overlay}>
                <Typography variant='h6'>{author}</Typography>
                <Typography variant='body2'>{createdAt}</Typography>
            </div>
            <div className={classes.overlay2}>
                <Link to={`/biketrails/${id}` } style={{color: 'white'}} ><DirectionsBikeIcon fontSize='default'/></Link>
            </div>
            <Typography className={classes.title}  variant='h5' gutterBottom>{name}</Typography>
            <CardContent>
                <Typography>{description}</Typography>
            </CardContent>
            <CardActions>

            </CardActions>
        </Card>
    )
}