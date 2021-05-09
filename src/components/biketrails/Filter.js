import React,{useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {TextField,Button,Typography,Paper,MenuItem} from '@material-ui/core'
import {Redirect} from 'react-router-dom'


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


// temporary hardcoded, later make db cluster
const categories = [{value:'All',label:'All'},
                    {value:'Mountain Bike',label:'Mountain Bike'},
                    {value:'Road Bike / Strassenrad',label:'Road Bike / Strassenrad'},
                    {value:'Hike / Wanderung',label:'Hike / Wanderung'},
                    {value:'Skitour',label:'Skitour'},
                    {value:'Schneeschuh Tour',label:'Schneeschuh Tour'},
                    {value:'Jogging',label:'Jogging'},
                    {value:'Walking',label:'Walking'}];

const initFilter = {
    search:'',
    category:'All'
}

export default function Filter(props){  
    const classes = useStyles()
    const [errorText,setErrorText] = useState(null)
    const [filter,setFilter] = useState(localStorage.getItem('filter') && JSON.parse(localStorage.getItem('filter')) || initFilter)
    const [open,setOpen] = useState(true)   

    const handleValidation = (search) => {
        let fieldIsValid = true
        let errors = {}
        setErrorText(null)
        console.log(search.text)

        if(!search.text.match(/^[a-zA-Z0-9\s]*$/)){
            errors['text'] = 'only letters and numbers allowed!'
            fieldIsValid = false
            setErrorText(errors)
        }
        
        console.log(errors)
        return fieldIsValid
    }


    const handleChange = (e) => {
        setFilter({...filter,[e.target.name]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        localStorage.setItem('filter',JSON.stringify(filter))
        setOpen(false)
    }

    return (
        <>
        {open ? <Paper className={classes.paper}>
            <Typography variant='h6'>Filter Options:</Typography>
            <form
                encType="multipart/form-data"
                autoComplete='off'
                noValidate 
                className={`${classes.root} ${classes.form}`}
                onSubmit={handleSubmit}
            >
                <TextField 
                    error={errorText && errorText['filter'] ? true : false}
                    helperText={errorText && errorText['filter']}
                    name='search'
                    label='Search'
                    variant='outlined'
                    fullWidth
                    value={filter.search}
                    onChange={handleChange}
                />
                <TextField
                    id="outlined-select-category"
                    name='category'
                    select
                    label="Select"
                    value={filter.category}
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
                <Button
                    className={classes.buttonSubmit}
                    variant='contained'
                    type='submit'
                    color='primary'
                    size='large'
                >
                    Submit
                </Button>
            </form>
        </Paper> : <Redirect to={`/biketrails`} />}
        </>
    )
}