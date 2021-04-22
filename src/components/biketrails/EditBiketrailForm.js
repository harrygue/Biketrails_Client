import React,{useState,useContext} from 'react'
import {useHistory,Redirect} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {TextField,Button,Typography,Paper,MenuItem} from '@material-ui/core'
import * as api from '../../api'
import {LogginContext,MessageContext,BiketrailContext} from '../../context/biketrails.context'
import {successMessages,errorMessages} from '../../other/messages'
import {biketrailActions} from '../../other/actionTypes'


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
export default function EditBiketrailForm(props){
    const classes = useStyles()
    const history = useHistory()
    const {id,name,description,location,category,gpxFileName,setAction} = props;
    const [loggedInUser,setLoggedInUser] = useContext(LogginContext)
    const [message,setMessage] = useContext(MessageContext)
    const [biketrail,dispatch] = useContext(BiketrailContext) // you need to declare the whole array here !
    const bt = {name,description,location,category}
    const [biketrailId,setBiketrailId] = useState(null)
    const [open,setOpen] = useState(true)
    const [biketrailData,setBiketrailData] = useState(bt)
    const [gpxFile,setGpxFile] = useState({})

    console.log('EditBiketrailForm: id: ',id)

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

    const updateBiketrail = (id,data,setMessage,setAction,history) => { 
        api.updateBikeTrail(id,data)
        .then(response => {
           if(response.status === 200){
               console.log(response)
               setMessage(successMessages.updateBiketrailOk(response.data.biketrail.name))  
               // setOpen(false)
               // setAction(null)
               dispatch({type:biketrailActions.UPDATE,biketrail:response.data.biketrail})
           }
        })
        .catch(err => {
            console.log(err.response)
            if(err.response && err.response.status === 401){
                setMessage(errorMessages.notAuthorized)
            } else {
                console.log(err)
                setMessage(errorMessages.updateFailure('Ops, something was wrong!'))
            }
            history.push('/')
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(`biketrail data: ${JSON.stringify(biketrailData)}`)
            var formData = new FormData()
            for(let name in biketrailData){
                biketrailData[name] && formData.append(name,biketrailData[name])
            }
            gpxFile && formData.append('gpxFile',gpxFile)
            
            updateBiketrail(id,formData,setMessage,setAction,history)
    }

    return (
        <>
            <Paper className={classes.paper}>
                <form
                    encType="multipart/form-data"
                    autoComplete='off'
                    noValidate 
                    className={`${classes.root} ${classes.form}`}
                    onSubmit={handleSubmit}
                >
                    <Typography variant='h6'>Edit a Biketrail</Typography>
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
                        onClick={() => { setAction(null) }}
                    >
                        Back
                    </Button>
                    </div>
                    <Typography variant='h6'>{gpxFileName && gpxFileName.split('\/').slice(-1)}</Typography>
                </form>
            </Paper>
        </>
    )
}