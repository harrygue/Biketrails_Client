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
        // console.log(sumDist);
        let totalDist = 0;
        distances.forEach((dist) => {
            totalDist+=dist;
        });
        // console.log(totalDist);
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
        let totalDistRound = parseFloat(totalDist).toFixed(1)
        var out = {
            sumDist:sumDist,
            totalDist:totalDistRound, 
            alt:alt,
            positionAvg:positionAvg,
            jsonObj:jsonObj, 
            geoJSONgpx:geoJSONgpx,
            fileName:fileName
        }
        cb(out)

    });
}