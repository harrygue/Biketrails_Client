import React,{useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import { MapContainer, TileLayer, GeoJSON,Polyline, Tooltip,LayersControl } from 'react-leaflet'
import getGpxParameters from '../../calculations/getGpxParameters';
import {Button, Typography} from '@material-ui/core';
import ContainerDimensions from 'react-container-dimensions'
import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import IconButton from '@material-ui/core/IconButton';

// https://github.com/plotly/react-plotly.js/issues/135#issuecomment-500399098
import createPlotlyComponent from 'react-plotly.js/factory';
const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

const useStyles = makeStyles({
    mapContainer: {
        display:'flex',
        flexDirection:'column',
        // justifyContent:'center',
        // alignItems:'center',
        height: props => `${200*props.plotSize.heightFactor}px`,//'200px',
        // width: '400px'
        transform: 'height 10s'
    },
    zoomOutMap: {
        display:'flex',
        flexDirection:'row',
        alignItems:'end',
        justifyContent:'end',
        height:'50px',
        width:'50px'
    }
})

// 
// const layout = (f) =>{
//     return {
//         title:'Elevation Profile',
//         showlegend: true,
//         legend: {
//           x: 1,
//           xanchor: 'right',
//           y: -1.0
//         },
//         // legend:{'orientation':'h'},
//         xaxis: {
//             title: 'Distance [km]',
//             showgrid: true,
//             zeroline: true
//         },
//         yaxis: {
//             title: 'Altitude [m]',
//             showgrid: true,
//             zeroline: true
//         },
//         width: 400*f,
//         height: 300*f
//       }
// }



// used for speed dependant color of gpx track
const getCompression = /*speedData*/ (speedpoints) => {
  const maxSpeed = Math.max(...speedpoints);//...speedData[0].y);
  const minSpeed = Math.min(...speedpoints);//...speedData[0].y)
  let delta = maxSpeed - minSpeed  
  return {
    compression:delta / 13,
    maxSpeed,
    minSpeed
  }
}

// colorPath uses 2nd order polynoms for the rgb calculation
const colorPath = (speed,compression) => {
  const red = [9.4048,-60.738,151.14]
  const green = [-8.6429,94.643,-21]
  const blue = [-4.2381,1.3333,240.14]
  
  const s = speed/compression
  const red_f = s*s * red[0] + s * red[1] + red[2]
  const green_f = s*s * green[0] + s * green[1] + green[2]
  const blue_f = s*s * blue[0] + s * blue[1] + blue[2]

  return `rgb(${red_f}, ${green_f}, ${blue_f})`
}

// show a colored vertical bar from min to max speed; indicate min and max speed
// add also an overlay with popup so when the user hovers over the gpx track the popup shows the speed
const ColoredSpeedBar = ({minSpeed,maxSpeed,compression,center,plotSize}) => {
  const {lat_avg,lon_avg} = center;
  const {heightFactor,zoomFactor} = plotSize;

  const speedArray = Array(Math.floor(maxSpeed)-Math.floor(minSpeed)).fill(1).map((n,i) => n+i)
  const increment = 0.1*zoomFactor/speedArray.length
  return (
    <>
      {speedArray.map((s,i) => 
        <Polyline 
          pathOptions={{"color": colorPath(s,compression),"weight": 10,"opacity": 0.65}} 
          positions={[[lat_avg + increment * i,lon_avg+0.2 * heightFactor],[lat_avg + increment * (i-1),lon_avg+0.2 * heightFactor]]} 
        >
          <Tooltip>{`Speed: ${s} km/h`}</Tooltip>
        </Polyline>
      )}
    </>
    
  )
}

export function PlotMapLeaflet(props){
    const mapRef = useRef();
    const {gpxFile,gpxFileName,lat,lng,togglePlot,plotSize} = props;
    const classes = useStyles(props);

    // console.log(props)

    let gpxParams = null

    getGpxParameters(gpxFile,gpxFileName,out =>{
        gpxParams = out
    })

    useEffect(() => {
        // console.log(mapRef && mapRef.current && mapRef.current._map.options)
        window.dispatchEvent(new Event('resize'));  
    })

    const {
      geoJSONgpx,
      coordinates,
      totalDist,
      sumDist,
      alt,
      lat_avg, 
      lon_avg, 
      zoom,
      // data,
      speedpoints,
      e_min,
      e_max,
      inclinationPoints,
      elevations
    } = gpxParams;

    const {compression,maxSpeed,minSpeed} = getCompression(speedpoints)

    return(
        
        <React.Fragment key={zoom}>
        {/*-------- MAP PLOT ------------*/}
        <Typography variant='h6'>Total Dist.: {totalDist} km</Typography>
        <Typography variant='h6'>Latitude / Longitude: {lat} / {lng}</Typography>
        <Typography variant='h6'>Min/Max Elevation: {e_min} / {e_max} m</Typography>
        <Typography variant='h6'>Cumulated Altitude: +{alt.pos} / {alt.neg} m</Typography>

        {/* Button to enlarge and shrink GPX plot not activated yet as not working well. 
            Continue later ...
        */}

        <IconButton
            className={classes.zoomOutMap}
            onClick={togglePlot}
        >
            <ZoomOutMapIcon/>
        </IconButton>

        <ContainerDimensions>
        {/* LEAFLET MAP */}
        {gpxParams && <MapContainer 
            className={classes.mapContainer} 
            center={[lat_avg, lon_avg]} 
            zoom={zoom*plotSize.zoomFactor} 
            scrollWheelZoom={true}
        >

            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {/* replace GeoJSON with Polyline segements to plot gpx with speed dependant color
              <GeoJSON 
                ref={mapRef}
                data={geoJSONgpx}
                pathOptions={{"color": "#6600ff","weight": 5,"opacity": 0.65}}
                zoom={zoom*plotSize.zoomFactor}
              />*/}

            { /* use Polylines for color dependant gpx plot. Plot separately colored polylines. */
                speedpoints.map((sd,i) => 
                  <Polyline 
                    pathOptions={{"color": colorPath(sd,compression),"weight": 5,"opacity": 0.65}} 
                    positions={[coordinates[i],coordinates[i+1]]}
                  >
                    {/*<Tooltip>{`Speed: ${Math.round(sd)} km/h`}</Tooltip>
                    <Tooltip>{`Speed: ${Math.round(sd)} km/h,\n\rAltitude: ${Math.round(elevations[i])} m,\n\rInclination: ${Math.round(inclinationPoints[i])} %`}</Tooltip>*/}
                    <Tooltip>{`Distance: ${Math.round(sumDist[i])} km,\rAltitude: ${Math.round(elevations[i])} m\rSpeed: ${Math.round(sd)} km/h`}</Tooltip>
                  </Polyline>
                )
            }
            
            {/*<ColoredSpeedBar minSpeed={minSpeed} maxSpeed={maxSpeed} compression={compression} center={{lat_avg, lon_avg}} plotSize={plotSize} />*/}
        </MapContainer>}
        </ContainerDimensions>

        </React.Fragment>
    )
}
