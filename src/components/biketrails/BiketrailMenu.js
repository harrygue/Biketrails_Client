import React,{useContext} from 'react';
import {useHistory} from 'react-router-dom'
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {MessageContext,SigninContext} from '../../context/biketrails.context'
import {deleteBiketrail} from '../../actions/biketrail.actions'


const options = [
  'Edit',
  'Delete',
  'Add Image'
];

const ITEM_HEIGHT = 48;

export default function BiketrailMenu({id,setAction,authorId}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const history = useHistory()
  const [message,setMessage] = useContext(MessageContext)
  const [loggedInUser,dispatchLoggedInUser] = useContext(SigninContext)
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {
    if(option.target.firstChild){
      setAction(option.target.firstChild.data) // used to redirect to biketrails in biketrail

      if(option.target.firstChild.data === 'Delete'){
        alert('Do you really want to delete this item ?')
        deleteBiketrail(id,setMessage,history,dispatchLoggedInUser)
      }
    } else {
      setAction(null)
    }

    setAnchorEl(null);
  };

  const handleCreateComment = () => {
    setAction('Create Comment'); 
    setAnchorEl(null);
  }

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
        {authorId === loggedInUser._id && options.map((option) => (
          <MenuItem key={option} onClick={option => handleClose(option)}>
            {option}
          </MenuItem>
        ))}
        <MenuItem onClick={handleCreateComment}>Create Comment</MenuItem>
      </Menu>
    </div>
  );
}
