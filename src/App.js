import React,{useState} from 'react'
import './App.css';
import Biketrails from './components/biketrails/Biketrails'
// import {MemoizedBiketrail} from './components/biketrails/Biketrail'
import Biketrail from './components/biketrails/Biketrail'
import {Switch,Route} from 'react-router-dom'
import {Container} from '@material-ui/core'
// import { makeStyles } from '@material-ui/core/styles';
import BiketrailForm from './components/biketrails/BiketrailForm';
import BiketrailsAppBar from './components/biketrails/BiketrailsAppbar'
import Login from './components/SignIn/Login'
import Register from './components/SignIn/Register'
// import {LogginContext} from './context/biketrails.context'



// const useStyles = makeStyles(theme => ({
//   appBar: {
//     borderRadius: 15,
//     margin: '30px 0',
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//   },
//   heading: {
//       color: 'rgba(0,183,255, 1)',
//       textDecoration:'none'
//   },
//   image: {
//       marginLeft: '15px',
//   },
//   [theme.breakpoints.down('sm')]:{
//       mainContainer: {
//           flexDirection: 'column-reverse'
//       }
//   }
// }))

function App() {

  return (
    <Container maxWidth='lg'>
      <BiketrailsAppBar />
      
        {/* Routes */}
        <Switch>
          <Route exact path={['/','/biketrails']} render={()=> <Biketrails />} />
          <Route exact path={'/createBiketrail'} render={()=> <BiketrailForm/>}/>
          <Route exact path='/biketrails/:id' render={(props)=> <Biketrail {...props} />} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/register' component={Register} />
        </Switch>
    </Container>
  );
}

export default App;

