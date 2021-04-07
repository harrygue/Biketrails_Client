import React,{useState,useContext} from 'react'
import './App.css';
import Biketrails from './components/Biketrails'
import Biketrail from './components/Biketrail'
import {Switch,Route,NavLink,Link} from 'react-router-dom'
import {Container,AppBar,Typography,Grid,Button} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';

import {DisplayContext} from './context/biketrails.context'
import BiketrailForm from './components/BiketrailForm';
import BiketrailsAppBar from './components/BiketrailsAppbar'



const useStyles = makeStyles(theme => ({
  appBar: {
    borderRadius: 15,
    margin: '30px 0',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  heading: {
      color: 'rgba(0,183,255, 1)',
      textDecoration:'none'
  },
  image: {
      marginLeft: '15px',
  },
  [theme.breakpoints.down('sm')]:{
      mainContainer: {
          flexDirection: 'column-reverse'
      }
  }
}))

function App() {
    const classes = useStyles();
    const [displayState] = useContext(DisplayContext)


    return (
    <Container maxWidth='lg'>
        <BiketrailsAppBar />
        <Container>
          <Grid className={classes.mainContainer} container justify='space-between' alignItems='stretch' spacing={3}>
            <Grid item xs={12} sm={12}>
                <h2>other grid</h2>
            </Grid>
          </Grid>
        </Container>
      
        {/* Routes */}
        {displayState.showTrails && <Biketrails />}
        {displayState.createTrail && <BiketrailForm />}
        <Switch>
          {/*<Route exact path={['/','/biketrails']} component={Biketrails} />
          <Route exact path={'/createBiketrail'} render={()=> <BiketrailForm />}/>*/}

          <Route exact path='/biketrails/:id' component={Biketrail} />
        </Switch>
    </Container>
    );
}

export default App;
