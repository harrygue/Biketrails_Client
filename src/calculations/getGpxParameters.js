import togeojson from "@mapbox/togeojson";
const parseString = require("xml2js").parseString;
const haversine = require('haversine-distance');
const DOMParser = require('xmldom').DOMParser;




export default function getGpxParameters(BTgpxFile,BTgpxFileName,cb){
    let file = BTgpxFile;// result.finalFile.file; //buff.toString('ascii');
    let fileName = BTgpxFileName;
    let filestr = file.toString('utf-8');
    
    var gpxFile = new DOMParser().parseFromString(file);    // resultFile.file);
    var geoJSONgpx = togeojson.gpx(gpxFile)

    parseString(filestr,(error,result) => {
        if(error){
            console.log("Error when parsing xml string"); //,error.message);
        }
        //console.log(result);
        let jsonObj = result;
            
        let elevations = [];
        let coordinates = [];
        let coordinatesDict = [];
        let distances = []
        let trkPts = jsonObj.gpx.trk[0].trkseg[0].trkpt;
        let latavg = 0;
        let lngavg = 0;
        trkPts.forEach((tp) => {
            elevations.push(tp.ele[0]);
            coordinates.push([tp.$.lat,tp.$.lon]);
            coordinatesDict.push(tp.$);
            // calculate sum of latitude and longitude
            latavg += tp.$.lat;
            lngavg += tp.$.lon;
        });
        latavg = latavg/coordinatesDict.length;
        lngavg = lngavg/coordinatesDict.length

        // calculate average of latitude and longitude
        let positionAvg = {lat: latavg,lng: lngavg};
        // console.log(positionAvg)

        // Calculate Distances:
        for (var i=1;i<coordinatesDict.length;i++){
            var a = coordinatesDict[i];
            var b = coordinatesDict[i-1];
            distances.push(haversine(a,b));
        }
        let sumDist = [distances[0]/1000];
        for (var i=0;i<distances.length;i++){
            sumDist.push(sumDist[i]+distances[i]/1000);
        }

        // TOTAL DISTANCE
        let totalDist = 0;
        distances.forEach((dist) => {
            totalDist+=dist;
        });

        // CUMULATED ALTITUDE DIFFERENCE
        let negAlt = 0;
        let posAlt = 0;
        for(var i=1;i<elevations.length;i++){
            let alt = elevations[i]-elevations[i-1];
            if (alt>0){
                posAlt+=alt;
            } else {
                negAlt+=alt;
            }
        }
        let alt = {pos:posAlt.toFixed(0),neg:negAlt.toFixed(0)};
        let totalDistRound = (parseFloat(totalDist)/1000).toFixed(1)

        // MIN AND MAX ELEVATION
        var e_min = 10000;
        var e_max = 0;
        elevations.forEach(e => {
            e_min = e < e_min ? e : e_min;
            e_max = e >= e_max ? e : e_max;
        });
        e_min = parseFloat(e_min).toFixed(1);
        e_max = parseFloat(e_max).toFixed(1);

        // CENTER OF MAP
        let lat_min = 100;
        let lat_max = 0;
        let lon_min = 100;
        let lon_max = 0;
        coordinates.forEach(x => {
            lat_min = lat_min < x[0] ? lat_min : x[0]
            lat_max = lat_max >= x[0] ? lat_max : x[0]
            lon_min = lon_min < x[1] ? lon_min : x[1]
            lon_max = lon_max > x[1] ? lon_max : x[1]
        });
        let lat_avg = lat_min/2 + lat_max/2;
        let lon_avg = lon_min/2 + lon_max/2;
        let lat_dst = lat_max-lat_min;
        let lon_dst = lon_max-lon_min;

      
        // Adjust zoom depending on lat_dst with 2nd order function
        let zoom = 13.033 - 22.766*lat_dst + 27.093*lat_dst*lat_dst;

        // DISPLAY GPX TRACK WITH  geoJSON
        var myLines = [{
            "type": "LineString",
            "coordinates": coordinates
        }];

        var myStyle = {
            "color": "#6600ff",
            "weight": 5,
            "opacity": 0.65
        };

        let trace1 = {
            x: sumDist,
            y: elevations,
            mode: "lines",
            name: "Elevation",
            line: {
                color: 'rgb(55, 128, 191)',
                width: 3
            }
        };

        let data = [trace1];

        // call layout in Plot.js directly
        // var layout = {
        //     title:'',
        //     xaxis: {
        //         title: 'Distance [km]',
        //         showgrid: true,
        //         zeroline: true
        //     },
        //     yaxis: {
        //         title: 'Altitude [m]',
        //         showgrid: true,
        //         zeroline: true
        //     },
        //     width: 400,
        //     height: 300
        //   };

        var out = {
            sumDist:sumDist,
            totalDist:totalDistRound, 
            alt:alt,
            positionAvg:positionAvg,
            jsonObj:jsonObj, 
            geoJSONgpx:geoJSONgpx,
            fileName:fileName,
            lat_avg, 
            lon_avg, 
            zoom,
            data,
            // layout,
            e_min,
            e_max
        }
        cb(out)

    });
}