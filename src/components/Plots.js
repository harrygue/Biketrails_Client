import React,{useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import getGpxParameters from '../calculations/getGpxParameters';
import {Button, Typography} from '@material-ui/core';

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
    }
})

// export function PlotElevation(props){
// 
//     const {gpxFile,gpxFilename} = props;
//     const {fileName,jsonObj,sumDist,geoJSONgpx} = getGpxParameters(gpxFile,gpxFilename)
//     // plot(fileName,lat,lng,jsonObj,sumDist,geoJSONgpx)
//     return(
//         <React.Fragment>
//             <h4>Elevation</h4>
//             <div id="elevation"></div>
//         </React.Fragment>
//     )
// }

export function PlotMapLeaflet(props){
    const mapRef = useRef();
    const {gpxFile,gpxFileName,lat,lng,togglePlot,plotSize} = props;
    const classes = useStyles(props);

    let gpxParams = null

    getGpxParameters(gpxFile,gpxFileName,out =>{
        gpxParams = out
    })

    const {totalDist,alt,lat_avg, lon_avg, zoom,data,layout,e_min,e_max} = gpxParams;

    return(
        
        <React.Fragment key={zoom}>
        {/*-------- MAP PLOT ------------*/}
        <Typography variant='h6'>Total Dist.: {totalDist} km</Typography>
        <Typography variant='h6'>Latitude / Longitude: {lat} / {lng}</Typography>
        <Typography variant='h6'>Min/Max Elevation: {e_min} / {e_max} m</Typography>
        <Typography variant='h6'>Cumulated Altitude: +{alt.pos} / {alt.neg} m</Typography>

        {/* Button to enlarge and shrink GPX plot not activated yet as not working well. 
            Continue later ...
        <Button 
            variant='outlined'
            size='small'
            color='secondary'
            onClick={togglePlot}
        >Large</Button>*/}

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
            <GeoJSON 
                data={gpxParams.geoJSONgpx}
                pathOptions={{"color": "#6600ff","weight": 5,"opacity": 0.65}}
                zoom={zoom}
            />
        </MapContainer>}
        
        {/*--------ELEVATION PLOT ------------*/}
        
        {gpxParams && <Plot
            data={data}
            layout={layout}
            config={{displayModeBar: false}}
        />}
        </React.Fragment>
    )
}
