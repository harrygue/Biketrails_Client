import React,{useState,useEffect,useContext} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {AppBar,Typography} from '@material-ui/core'
import {NavLink} from 'react-router-dom'
import bikeicon from '../../iconpictures/bikeicon.PNG';
import BiketrailsAppBarMenu from './BiketrailsAppBarMenu'
import {AppBarUser} from './AppBarUser'
import {MessageContext} from '../../context/biketrails.context'



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

export default function BiketrailsAppBar(props){
    const [message,setMessage] = useContext(MessageContext)
    const classes = useStyles()
    const [user,setUser] = useState(localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).message.username : null)
    useEffect(() => {
        setUser(localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).message.username : null)
    },[user,message])   
    return (
        <AppBar className={classes.appBar} position='static' color='inherit'>
            <img className={classes.image} src={bikeicon} alt='biketrails' height='60' />
            <Typography className={classes.heading} variant='h2' align='center'>
              <NavLink to='/biketrails' style={{textDecoration: 'none'}}>Bike Trails</NavLink>
            </Typography>
            {/*<NavLink to='/createBiketrail' style={{fontSize:'20px'}}>Create Biketrail</NavLink>*/}
            <BiketrailsAppBarMenu />
            <AppBarUser user={user}/>
        </AppBar>
    )
}