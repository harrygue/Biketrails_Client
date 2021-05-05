import React,{useState,useContext} from 'react'
import {useHistory,Redirect} from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles';
import {TextField,Button,Typography,Paper,MenuItem} from '@material-ui/core'
import {MessageContext,SigninContext} from '../../context/biketrails.context'
import {updateBiketrail} from '../../actions/biketrail.actions'


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
    const [loggedInUser,dispatchLoggedInUser] = useContext(SigninContext)
    const bt = {name,description,location,category}
    const [biketrailData,setBiketrailData] = useState(bt)
    const [gpxFile,setGpxFile] = useState({})
    const [errorText,setErrorText] = useState(null)

    const handleValidation = (btData) => {
        let fieldIsValid = true
        let errors = {}
        setErrorText(null)
        console.log(btData['name'])
        if(!btData['name']){
            fieldIsValid = false
            errors['name'] = 'Field required'
            setErrorText(errors)
        } else if(!btData['name'].match(/^[a-zA-Z0-9\s]*$/)){
            errors['name'] = 'only letters and numbers allowed!'
            fieldIsValid = false
            setErrorText(errors)
        }
        if(!btData.description.match(/^[a-zA-Z0-9\s]*$/)){
            errors['description'] = 'only letters and numbers allowed!'
            fieldIsValid = false
            setErrorText(errors)
        }
        if(!btData.location.match(/^[a-zA-Z0-9\s,]*$/)){
            errors['location'] = 'only letters and numbers allowed!'
            fieldIsValid = false
            setErrorText(errors)
        }
        
        console.log(errors)
        return fieldIsValid
    }

    const handleChange = (e) => {
        if(e.target.name !== 'gpx'){
            //console.log(e.target.name)
            setBiketrailData({...biketrailData,[e.target.name]:e.target.value})
        } else {
            // console.log(e.target.name)
            // console.log(e.target.files[0])
            setGpxFile(e.target.files[0])
        }

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(`biketrail data: ${JSON.stringify(biketrailData)}`)
            var formData = new FormData()
            for(let name in biketrailData){
                biketrailData[name] && formData.append(name,biketrailData[name])
            }
            gpxFile && formData.append('gpxFile',gpxFile)
            
            handleValidation(biketrailData) && updateBiketrail(id,formData,setMessage,history,dispatchLoggedInUser)
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
                        error={errorText && errorText['name'] ? true : false}
                        helperText={errorText && errorText['name']}
                        name='name'
                        label='Title'    
                        variant='outlined'
                        fullWidth
                        value={biketrailData.name}
                        onChange={handleChange}
                    />
                    
                    <TextField 
                        error={errorText && errorText['description'] ? true : false}
                        helperText={errorText && errorText['description']}
                        name='description'
                        label='Description'
                        variant='outlined'
                        fullWidth
                        value={biketrailData.description}
                        onChange={handleChange}
                    />
                    <TextField 
                        error={errorText && errorText['location'] ? true : false}
                        helperText={errorText && errorText['location']}
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