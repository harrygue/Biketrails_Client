import React,{useRef,useEffect} from 'react'
import {makeStyles} from '@material-ui/core/styles';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'

import getGpxParameters from '../calculations/getGpxParameters';
import getPlotParameters from '../calculations/getPlotParameters'
// import togeojson from "@mapbox/togeojson";
// import { Map,LayerGroup } from 'leaflet';
// import mapboxgl from 'mapbox-gl/dist/mapbox-gl-csp';
// eslint-disable-next-line import/no-webpack-loader-syntax
// import MapboxWorker from 'worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker';

// mapboxgl.workerClass = MapboxWorker;
// mapboxgl.accessToken = "pk.eyJ1IjoiaGFycnlndWUiLCJhIjoiY2s2ang1ajlmMDBycjNlcnpudTZsc2toaSJ9.RFqAywgBUzZfnuN_N1TfDA" //'YOUR_MAPBOX_ACCESS_TOKEN';

const useStyles = makeStyles(theme => ({
    mapContainer: {
        display:'flex',
        flexDirection:'column',
        // justifyContent:'center',
        // alignItems:'center',
        height: '200px',
        // width: '400px'
    }
}))


export function PlotElevation(props){

    const {gpxFile,gpxFilename} = props;
    const {fileName,jsonObj,sumDist,geoJSONgpx} = getGpxParameters(gpxFile,gpxFilename)
    // plot(fileName,lat,lng,jsonObj,sumDist,geoJSONgpx)
    return(
        <React.Fragment>
            <h4>Elevation</h4>
            <div id="elevation"></div>
        </React.Fragment>
    )
}

export function PlotMapLeaflet(props){
    const mapRef = useRef();

    const classes = useStyles();
    const {gpxFile,gpxFileName,lat,lng} = props;
    // console.log(gpxFileName,lat,lng)
    let gpxParams = null
    let plotParams = null

    // console.log('RENDER PLOTMAPLEAFLET: ',gpxFileName)

    getGpxParameters(gpxFile,gpxFileName,out =>{
        gpxParams = out
        // console.log('called getGpxParameters')
    })

    const {fileName,jsonObj,sumDist,geoJSONgpx} = gpxParams;

    getPlotParameters(fileName,jsonObj,sumDist,out => {
        plotParams = out
        // console.log('called getPlotParameters')
    })

    const {lat_avg, lon_avg, zoom} = plotParams

    // console.log('Plots: ',plotParams)
    // console.log('gpxParams: ',gpxParams.geoJSONgpx)

    // add key to child component to cause an update

    return(
        <React.Fragment key={plotParams.zoom}>
        {plotParams && gpxParams && <MapContainer 
            
            className={classes.mapContainer} 
            center={[plotParams.lat_avg, plotParams.lon_avg]} 
            zoom={plotParams.zoom} 
            scrollWheelZoom={false}
        >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <GeoJSON 
                data={gpxParams.geoJSONgpx}
                pathOptions={{"color": "#6600ff","weight": 5,"opacity": 0.65}}
                zoom={plotParams.zoom}
            />
        </MapContainer>}
        </React.Fragment>
    )
}
