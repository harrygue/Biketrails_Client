import React,{useContext} from 'react';
import {useHistory} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as api from '../../api'
import {LogginContext,MessageContext,BiketrailContext} from '../../context/biketrails.context'

const options = [
  'Edit',
  'Delete',
  'Add Image',
  'Create Comment'
];

const ITEM_HEIGHT = 48;

export default function BiketrailMenu({id,selectAction,setAction}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory()
  const [loggedInUser,setLoggedInUser] = useContext(LogginContext)
  const [message,setMessage] = useContext(MessageContext)
  const [biketrail,dispatch] = useContext(BiketrailContext) // you need to declare the whole array here !
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {

    if(option.target.firstChild){
      console.log(option.target.firstChild.data)
      setAction(option.target.firstChild.data) // used to redirect to biketrails in biketrail

      if(option.target.firstChild.data === 'Delete'){
        alert('Do you really want to delete this item ?')
        dispatch({type:'DELETEBIKETRAIL',id,setMessage,setAction,history})
      }
    } else {
      setAction(null)
    }

    setAnchorEl(null);
  };

 return (
    <div>
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
        {options.map((option) => (
          <MenuItem key={option} onClick={option => handleClose(option)}>
            {option}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
