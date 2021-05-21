import togeojson from "@mapbox/togeojson";
const parseString = require("xml2js").parseString;
const haversine = require('haversine-distance');
const DOMParser = require('xmldom').DOMParser;

/* ENVELOP ABOVE MAX POINTS OF ELEVATION PROFILE
use same sample size as in float avg
look for max within thin sample span
attribute the max to the end of the sample span
interpolate all point in the sample span between the start point (actual value)
and end point with the max from the sample span
this is then the start point for the next sample span
*/
const getEnvelopElevationProfile = (sampleSize,elevations) => {
    let q = []
    let slope = 1
    let newElevations = []
    for(let i = 0; i < elevations.length;i++){
        // calculate envelope
        q.push(parseFloat(elevations[i]))
        let max = undefined
        let min = undefined
        let start = null
        if(q.length  === sampleSize){
            max = Math.max(...q)
            min = Math.min(...q)
            start = newElevations.length > 0 && newElevations[newElevations.length - 1] > q[0] ? newElevations[newElevations.length - 1] : q[0]

            // interpolate between start and max
            let interpolatedElevation = null
            for (let j = 0; j < q.length; j++){
                interpolatedElevation = (max - start) / sampleSize * j + start
                newElevations.push(interpolatedElevation)
            }

            q = [] // reset q if sampleSize reached and max obtained
        }

    }
    return newElevations
}

// FLOATING ELEVATION AVERAGE
const getElevationFloatAvg = (sampleSize,sumDist,elevations) => {
    let q = []
    let newElevations = []
    for (let i = 0; i<sumDist.length;i++){
        q.push(parseFloat(elevations[i]))
        if (q.length > sampleSize){
            q.splice(0,1)
        }

        const avg = q.reduce((total,el) => total+el)/q.length
        newElevations.push(avg)
    }

    return newElevations
}

// CUMULATED ALTITUDE DIFFERENCE
const getCumAltDiff = (elevations) => {
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
    return {pos:posAlt.toFixed(0),neg:negAlt.toFixed(0)};
}

// MIN AND MAX ELEVATION
const getMinAndMaxElevation = (elevations) => {
    var e_min = 10000;
    var e_max = 0;
    elevations.forEach(e => {
        e_min = e < e_min ? e : e_min;
        e_max = e >= e_max ? e : e_max;
    });
    e_min = parseFloat(e_min).toFixed(1);
    e_max = parseFloat(e_max).toFixed(1);
    return {e_min,e_max}
}

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

        // plug in floating average of elevations
        const sampleSize = 40
        const avgElevations = getElevationFloatAvg(sampleSize,sumDist,elevations)
        const sampleSize2 = 20
        const envelopeElevations = getEnvelopElevationProfile(sampleSize2,elevations,avgElevations)


        // CUMULATED ALTITUDE DIFFERENCE
        const alt = getCumAltDiff(elevations)
        const altFromAvgElevations = getCumAltDiff(avgElevations)
        const altFromEnvelopeElevations = getCumAltDiff(envelopeElevations)

        let totalDistRound = (parseFloat(totalDist)/1000).toFixed(1)

        // MIN AND MAX ELEVATION
        const eMinMax = getMinAndMaxElevation(elevations)
        const eMinMaxFromAvgElevations = getMinAndMaxElevation(avgElevations)

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
        let trace2 = {
            x: sumDist,
            y: avgElevations,
            mode: "lines",
            name: `filtered Elevation (${sampleSize} Samples)`,
            line: {
                color: 'rgb(245, 66, 114)',
                width: 3,
                dash:'dash'
            }
        };

        let trace3 = {
            x: sumDist,
            y: envelopeElevations,
            mode: "lines",
            name: `envelopped Elevation (${sampleSize2} Samples)`,
            line: {
                color: 'rgb(245, 66, 114)', // 'rgb(57, 252, 3)',
                width: 3,
                dash:'line'
            }
        };

        let data = [trace3]// [trace1,trace2,trace3];

        // console.log('in getGpxParameters')
        // console.log(alt)
        // console.log('Alt from avgElevations: ',altFromAvgElevations)
        // console.log('Alt from envelopeElevations: ',altFromEnvelopeElevations)
        // console.log(eMinMax)
        // console.log('eMInMax from avgElevations',eMinMaxFromAvgElevations)

        var out = {
            sumDist,
            totalDist:totalDistRound, 
            alt:altFromEnvelopeElevations, //altFromAvgElevations,
            positionAvg,
            jsonObj, 
            geoJSONgpx,
            fileName,
            lat_avg, 
            lon_avg, 
            zoom,
            data,
            e_min:eMinMax.e_min,
            e_max:eMinMax.e_max
        }
        cb(out)

    });
}