import React,{useEffect, useRef} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import getGpxParameters from '../calculations/getGpxParameters';
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

const layout = (f) =>{
    return {
        title:'Elevation Profile',
        showlegend: true,
        legend: {
          x: 1,
          xanchor: 'right',
          y: -1.0
        },
        // legend:{'orientation':'h'},
        xaxis: {
            title: 'Distance [km]',
            showgrid: true,
            zeroline: true
        },
        yaxis: {
            title: 'Altitude [m]',
            showgrid: true,
            zeroline: true
        },
        width: 400*f,
        height: 300*f
      }
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

    const {totalDist,alt,lat_avg, lon_avg, zoom,data,e_min,e_max} = gpxParams;

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
                ref={mapRef}
                data={gpxParams.geoJSONgpx}
                pathOptions={{"color": "#6600ff","weight": 5,"opacity": 0.65}}
                zoom={zoom*plotSize.zoomFactor}
            />
        </MapContainer>}
        </ContainerDimensions>
        
        {/*--------ELEVATION PLOT ------------*/}
        
        {gpxParams && <Plot
            data={data}
            layout={layout(plotSize.f)}
            config={{displayModeBar: true}}
        />}
        </React.Fragment>
    )
}
