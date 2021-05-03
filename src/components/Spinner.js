import Loader from "react-loader-spinner";
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        margin: '0 auto',
        marginTop: '5rem'
    }
}))

export const Spinner = () => {
  //other logic
    const classes = useStyles()
    return (
      <Loader
        className={classes.root}
        type="TailSpin"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={5000} //3 secs
      />
    );
}