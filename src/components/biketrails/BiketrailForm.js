import React,{useContext, useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {TextField,Button,Typography,Paper,MenuItem} from '@material-ui/core'
import * as api from '../../api'
import Biketrails from './Biketrails';
import {useHistory,Redirect} from 'react-router-dom'
import {LogginContext,MessageContext,BiketrailContext} from '../../context/biketrails.context'
import {successMessages,errorMessages} from '../../other/messages'


// temporary hardcoded, later make db cluster
const categories = [{value:'All',label:'All'},
                    {value:'Mountain Bike',label:'Mountain Bike'},
                    {value:'Road Bike / Strassenrad',label:'Road Bike / Strassenrad'},
                    {value:'Hike / Wanderung',label:'Hike / Wanderung'},
                    {value:'Skitour',label:'Skitour'},
                    {value:'Schneeschuh Tour',label:'Schneeschuh Tour'},
                    {value:'Jogging',label:'Jogging'},
                    {value:'Walking',label:'Walking'}];

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
    fileInput: {
        width: '97%',
        margin: '10px 0',
    },
    buttonSubmit: {
        marginBottom: 10,
    },
}))

const emptyBT = {
    name: '',
    description:'',
    location:'',
    category:'',
    gpxFile:''
}

export default function BiketrailForm(props){
    const [message,setMessage] = useContext(MessageContext)
    const [loggedInUser,setLoggedInUser] = useContext(LogginContext)
    const [biketrail,dispatch] = useContext(BiketrailContext) // you need to declare the whole array here !
    const classes = useStyles()
    const history = useHistory()
    const [biketrailData,setBiketrailData] = useState(emptyBT)
    const [biketrailId,setBiketrailId] = useState(null)
    const [gpxFile,setGpxFile] = useState({})
    const [open,setOpen] = useState(true)


    const handleChange = (e) => {
        if(e.target.name !== 'gpx'){
            console.log(e.target.name)
            setBiketrailData({...biketrailData,[e.target.name]:e.target.value})
        } else {
            console.log(e.target.name)
            console.log(e.target.files[0])
            setGpxFile(e.target.files[0])
        }

    }

    const createBiketrail = (data,setMessage,setOpen,history) => {
        console.log('createBiketrail in biketrailReducer.js')
        api.createBikeTrail(data)
        .then(response => {
            if(response.status === 200){
                console.log(response.data.message)
                setMessage(successMessages.createBiketrailOk(response.data.biketrail.name))  
                setOpen(false)
                setBiketrailId(response.data.biketrail._id)
                dispatch({type:'CREATEBIKETRAIL',biketrail:response.data.biketrail})
            }
        })
        .catch(err => {
            console.log(err.response)
            if(err.response.status === 401){
                setMessage(errorMessages.notAuthorized)
            } else {
                console.log('create biketrail error: else')
                setMessage(errorMessages.createFailure(err.response.data.error.message))
            }
            history.push('/')
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(`biketrail data: ${JSON.stringify(biketrailData)}`)
        var formData = new FormData()
        for(let name in biketrailData){
            formData.append(name,biketrailData[name])
        }
        formData.append('gpxFile',gpxFile)

        createBiketrail(formData,setMessage,setOpen,history)
        //dispatch({type:'CREATEBIKETRAIL',formData,setMessage,setOpen,setLoggedInUser,history})
    }
    
    // add entype for file upload
    return (
        <>
            {open ? <Paper className={classes.paper}>
                <form
                    encType="multipart/form-data"
                    autoComplete='off'
                    noValidate 
                    className={`${classes.root} ${classes.form}`}
                    onSubmit={handleSubmit}
                >
                    <Typography variant='h6'>Create a Biketrail</Typography>
                    <TextField 
                        name='name'
                        label='Title'    
                        variant='outlined'
                        fullWidth
                        value={biketrailData.name}
                        onChange={handleChange}
                    />
                    
                    <TextField 
                        name='description'
                        label='Description'
                        variant='outlined'
                        fullWidth
                        value={biketrailData.description}
                        onChange={handleChange}
                    />
                    <TextField 
                        name='location'
                        label='Location'
                        variant='outlined'
                        fullWidth
                        value={biketrailData.location}
                        onChange={handleChange}
                    />
                    <div style={{width:'100%',display:'flex',flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    {/* select field */}
                    <TextField
                        id="outlined-select-category"
                        name='category'
                        select
                        label="Select"
                        value={biketrailData.category}
                        onChange={handleChange}
                        helperText="Please select the category"
                        variant="outlined"
                        style={{width:'50%'}}
                    >
                        {categories.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                    </TextField>
                    {/* file input */}
                    <input
                        style={{ display: "none" }}
                        id="contained-button-file"
                        type="file"
                        name='gpx'
                        accept="gpx/*"
                        onChange={handleChange}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" color="secondary" component="span">
                            GPX File Upload
                        </Button>
                    </label>
                    <Button
                        className={classes.buttonSubmit}
                        variant='contained'
                        type='submit'
                        color='primary'
                        size='large'
                    >
                        Submit
                    </Button>
                    <Button
                        variant='outlined'
                        size='small'
                        color='secondary'
                        onClick={() => {setBiketrailData(emptyBT) }}
                    >
                        Clear
                    </Button>
                    </div>
                </form>
            </Paper> : 
            <Redirect to={`/biketrails/${biketrailId}`} />}

        </>
    )
}