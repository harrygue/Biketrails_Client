import React,{useState,useContext} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {NavLink} from 'react-router-dom'
import {MessageContext,SigninContext} from '../../context/biketrails.context'
import {logoutUser} from '../../actions/signin.actions'


const ITEM_HEIGHT = 48;

export default function BiketrailsAppBarMenu(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [setAction] = useState(null)
  const open = Boolean(anchorEl);
  const [loggedIn,dispatch] = useContext(SigninContext)
  const [message,setMessage] = useContext(MessageContext)

  console.log(loggedIn)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = (e) => {
    e.preventDefault()
    logoutUser(setMessage,dispatch)
  }

  const handleClose = (option) => {

    if(option.target.firstChild){
      console.log(option.target.firstChild.data)
      setAction(option.target.firstChild.data) // used to redirect to biketrails in biketrail
    }
    setAnchorEl(null);
  };

 return (
    <React.Fragment>
      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            width: '20ch',
          },
        }}
      >
        {!loggedIn && <MenuItem>
          <NavLink to='/login' style={{textDecoration:'none'}}>Login</NavLink>
        </MenuItem>}
        {!loggedIn && <MenuItem>
          <NavLink to='/register' style={{textDecoration:'none'}}>Sign Up</NavLink>
        </MenuItem>}
        {loggedIn && <MenuItem>
          <p  style={{textDecoration:'none'}} onClick={handleLogout}>Logout</p>
        </MenuItem>}
        {loggedIn && <MenuItem>
          <NavLink to='/createBiketrail' style={{textDecoration:'none'}}>Create Biketrail</NavLink>
        </MenuItem>}

      </Menu>
    </React.Fragment>
  );

}