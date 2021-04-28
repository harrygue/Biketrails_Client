import React,{useContext, useEffect} from 'react';
import BiketrailCard from './BiketrailCard'
import { makeStyles } from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import {MessageContext, SigninContext,AllBiketrailsContext} from '../../context/biketrails.context'
import Message from '../Message'
import {fetchBiketrails} from '../../actions/biketrail.actions'
import {useHistory} from 'react-router-dom'




const useStyles = makeStyles(theme =>({
    mainContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    smMargin: {
      margin: theme.spacing(1),
    },
    actionDiv: {
      textAlign: 'center',
    },
}))

export default function Biketrails(props){
    const [message,setMessage] = useContext(MessageContext);
    const history = useHistory()
    const classes = useStyles();
    const [biketrails,dispatch ]= useContext(AllBiketrailsContext)
    const [loggedInUser,dispatchLogin] = useContext(SigninContext)

    useEffect(() => {
        dispatchLogin({type:null})
    },[dispatchLogin])

    useEffect(() => {
        fetchBiketrails(dispatch,setMessage,history)
    },[message])

    return (
        <Grid container className={classes.mainContainer}
            alignItems='stretch' spacing={3}
        >
            <Message />
            {biketrails && biketrails.length>0 && biketrails.map(biketrail =>
                <Grid item key={biketrail._id} xs={12} sm={4}>
                    <BiketrailCard
                        id={biketrail._id} 
                        name={biketrail.name}
                        author={biketrail.author.userName}
                        discription={biketrail.description}
                        createdAt={biketrail.createdAt}
                        location={biketrail.location}
                        image={biketrail.images.length >0 && biketrail.images[0].image}
                    />
                </Grid>
            )}
        </Grid>
    )
}
