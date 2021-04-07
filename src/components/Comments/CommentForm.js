import React,{useState} from 'react'
import * as api from '../../api'
import {makeStyles} from '@material-ui/core/styles'
import {Card,CardContent,TextField,Button,Typography} from '@material-ui/core'


const useStyles = makeStyles(theme => ({
    root: {
        '& .MuiTextField-root': {
          margin: theme.spacing(1),
        },
    },
    paper: {
      padding: theme.spacing(2),
    },
    form: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    buttonSubmit: {
        marginBottom: 10,
    },
}))

export default function CommentForm(props){
    const classes = useStyles()
    const {biketrailId,commentId=null,setAction,setCommentAction,setStatus,text='write a comment'} = props;
    const [comment,setComment] = useState(text)

    const handleChange = (e) => {
        setComment(e.target.value)
    }

    const handleSubmit = (e) => {
        console.log('hit handleSubmit')
        console.log(comment)
        e.preventDefault()

        // ----------------------- CREATE COMMENT ---------------------------
        const createComment = async ( bt_id, data) => {
            const response = await api.createComment(bt_id,{'comment':data})
            console.log(response)
            if (response.status === 201){
                console.log('Response: ',response)
                setAction(null)
                // setMessage(response.data.message)
                setStatus("success")
            }
        }

        // ------------------ UPDATE COMMENT -----------------------
        const updateComment = async (bt_id,commentId,data) => {
            const response = await api.updateComment(bt_id,commentId,{'comment':data})

            if(response.status === 200){
                console.log('Response: ',response.data)
                setCommentAction(null)
                // setMessage(response.data.message)
                setStatus("success")
            }
        }
        console.log(commentId)
        commentId ? updateComment(biketrailId,commentId,comment) : createComment(biketrailId,comment)
    }

    return(
        <Card>
            <CardContent>
            <form
                encType="multipart/form-data"
                autoComplete='off'
                noValidate
                className={`${classes.root} ${classes.form}`}
                
            >
                <Typography variant='h6'>{commentId ? 'Edit' : 'Create'} a Comment</Typography>
                <TextField
                    name='comment'
                    label='New Comment'
                    variant='outlined'
                    fullWidth
                    value={comment}
                    onChange={handleChange}
                />
                <Button
                    className={classes.buttonSubmit}
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                >
                    Create
                </Button>
            </form>
            </CardContent>
        </Card>
    )
}