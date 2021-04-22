import React,{useState,useContext} from 'react'
import {useHistory} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {TextField,Button,Typography,Paper,MenuItem} from '@material-ui/core'
import * as api from '../../api'
import {MessageContext} from '../../context/biketrails.context'
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

export default function EditBiketrailForm(props){
    const classes = useStyles()
    const history = useHistory()
    const {id,name,description,location,category,gpxFileName,setAction} = props;
    const [message,setMessage] = useContext(MessageContext)
    const bt = {name,description,location,category}
    const [biketrailData,setBiketrailData] = useState(bt)
    const [gpxFile,setGpxFile] = useState({})

    const handleChange = (e) => {
        if(e.target.name !== 'gpx'){
            setBiketrailData({...biketrailData,[e.target.name]:e.target.value})
        } else {
            setGpxFile(e.target.files[0])
        }

    }

    const updateBiketrail = (id,data,setMessage,history) => { 
        api.updateBikeTrail(id,data)
        .then(response => {
           if(response.status === 200){
               // console.log(response)
               setMessage(successMessages.updateBiketrailOk(response.data.biketrail.name))  
           }
        })
        .catch(err => {
            console.log(err.response)
            if(err.response.status === 401){
                setMessage(errorMessages.notAuthorized)
            } else {
                setMessage(errorMessages.updateFailure(err.response.data.error.message))
            }
            history.push('/')
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log(`biketrail data: ${JSON.stringify(biketrailData)}`)
            var formData = new FormData()
            for(let name in biketrailData){
                biketrailData[name] && formData.append(name,biketrailData[name])
            }
            gpxFile && formData.append('gpxFile',gpxFile)
            
            updateBiketrail(id,formData,setMessage,history)
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