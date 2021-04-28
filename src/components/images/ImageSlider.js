import React,{Component,useContext} from 'react'
import '../../styles/ImageSliderStyles.css'
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'; // left
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'; // right
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import {useHistory} from 'react-router-dom'
import {MessageContext} from '../../context/biketrails.context'
import {deleteImage} from '../../actions/image.actions'

class ImageSlider extends Component {
    constructor(props) {
      super(props)
      this.state = {
        currentIndex: 0,
        translateValue: 0
      }
    }
  
    goToPrevSlide = () => {
      if(this.state.currentIndex === 0)
        return;
      
      this.setState(prevState => ({
        currentIndex: prevState.currentIndex - 1,
        translateValue: prevState.translateValue + this.slideWidth()
      }))
    }
  
    goToNextSlide = () => {
      // Exiting the method early if we are at the end of the images array.
      // We also want to reset currentIndex and translateValue, so we return
      // to the first image in the array.
      // this.state.images => images
      if(this.state.currentIndex === this.props.images.length - 1) {
        return this.setState({
          currentIndex: 0,
          translateValue: 0
        })
      }
      
      // This will not run if we met the if condition above
      this.setState(prevState => ({
        currentIndex: prevState.currentIndex + 1,
        translateValue: prevState.translateValue + -(this.slideWidth())
      }));
    }
  
    slideWidth = () => {
       return document.querySelector('.slide').clientWidth
    }
  
    render() {
      // console.log(this.props.images)
      return (
        <div className="slider">
  
          <div className="slider-wrapper"
            style={{
              transform: `translateX(${this.state.translateValue}px)`,
              transition: 'transform ease-out 0.45s'
            }}>
              {
                // this.state.
                this.props.images.map((image, i) => (
                  <>
                    <Slide key={i} image={image}/>
                  </>
                ))
              }
          </div>
  
          <LeftArrow
           goToPrevSlide={this.goToPrevSlide}
          />
  
          <RightArrow
           goToNextSlide={this.goToNextSlide}
          />
          <WasteBasket image={this.props.images[this.state.currentIndex]} biketrail_id={this.props.biketrail_id}/>
        </div>
      );
    }
  }
  
  
  const Slide = (props) => {
    const {image} = props.image
    const styles = {
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '50% 60%'
    }
    return (
      <div className="slide" style={styles}></div>
    )
  }
  
  const LeftArrow = (props) => {
    return (
      <div  className="backArrow arrow" onClick={props.goToPrevSlide}>
        <ArrowBackIosIcon style={{fontSize:'25px'}}/>
      </div>
    );
  }
  //  className="backArrow arrow" 
  
  const RightArrow = (props) => {
    return (
      <div className="nextArrow arrow" onClick={props.goToNextSlide}>
        <ArrowForwardIosIcon  style={{fontSize:'25px'}}/>
      </div>
    );
  }
  
  const WasteBasket = ({image,biketrail_id}) => {
    const history = useHistory()
    const [message,setMessage] = useContext(MessageContext)
    return (
      <div className="wasteBasket">
        <DeleteOutlinedIcon onClick={
            () => {
              console.log('waste basket',biketrail_id,image._id)
              deleteImage(biketrail_id,image._id,setMessage,history)
            }
          }/>
      </div>
    )
  }

  export const MemoizedImageSlider = React.memo(ImageSlider);