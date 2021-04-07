import React,{useState,useContext} from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import * as api from '../../api'
import {MessageContext} from '../../context/biketrails.context'

const options = [
  'Edit Comment',
  'Delete Comment',
];

const ITEM_HEIGHT = 48;

export default function CommentMenu({biketrailId,commentId,setCommentAction,setStatus}) {
  const [message,setMessage] = useContext(MessageContext)
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (option) => {

    if(option.target.firstChild){
      console.log(option.target.firstChild.data)
      setCommentAction(option.target.firstChild.data) // used to redirect to comments in biketrail

      // --------------- DELETE COMMENT ----------------------
      if(option.target.firstChild.data === 'Delete Comment'){
        alert('Do you really want to delete this item ?')
        console.log(commentId)
        api.deleteComment(biketrailId,commentId)
        .then(response => {
          console.log(JSON.stringify(response))
          if(response.status === 201){
            console.log(response.data)
            setStatus('success')
            // setMessage(response.data.message)
          }
        })
      }
    } else {
      setCommentAction(null)
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
