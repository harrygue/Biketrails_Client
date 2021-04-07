import React,{useContext} from 'react';
import BiketrailCard from './BiketrailCard'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography} from '@material-ui/core';
import {useAllBiketrailState} from '../../hooks/useAllBiketrailState'
import {MessageContext} from '../../context/biketrails.context'
import Message from '../Message'



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
    const classes = useStyles();
    const [biketrails] = useAllBiketrailState();
    // const biketrails = useContext(BiketrailsContext)
    console.log(biketrails)
    console.log('MESSAGE: ',message)

    return (
        <Grid container className={classes.mainContainer}
            alignItems='stretch' spacing={3}
        >
            <Message />
            {/*<Grid item xs={12} sm={12}>
              {message && <Typography variant='h3' style={{color:'green'}}>{message}</Typography>}
              {message && setTimeout(() => {
                  setMessage(null)
              },3000)}
            </Grid>*/}
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
