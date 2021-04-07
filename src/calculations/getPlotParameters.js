export default function getPlotParameters(fileName,jsonObj,sumDist,cb){
    // OPEN STREET MAPS AND LEAFLET
    // console.log(fileName);
    if(fileName !== 'unknown'){

        let elevations = [];
        let coordinates = [];

        // let trkPts = JSON.stringify(jsonObj.gpx.trk[0].trkseg[0].trkpt,null,4); 
        let trkPts = jsonObj.gpx.trk[0].trkseg[0].trkpt;
        trkPts.forEach((tp) => {
            elevations.push(tp.ele[0]);
            coordinates.push([tp.$.lat,tp.$.lon]);
        });

        // get min and max elevation
        var e_min = 10000;
        var e_max = 0;
        elevations.forEach(e => {
            e_min = e < e_min ? e : e_min;
            e_max = e >= e_max ? e : e_max;
        });
        e_min = parseFloat(e_min).toFixed(1);
        e_max = parseFloat(e_max).toFixed(1);
        // console.log(`Min. / Max. Elevation (m): ${e_min} / ${e_max}`);
        // document.getElementById("li3").innerText = `Min. / Max. Elevation (m): ${e_min} / ${e_max}`;
        // $(document).ready(function(){
        //     $("#li3").text(`Lowest / Highest Elevation: ${e_min} / ${e_max} (meter)`);
        // });

        // calculate center of map
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


        // console.log(`min_lat: ${lat_min} and max_lat: ${lat_max}`);
        // console.log(`min_lon: ${lon_min} and max_lon: ${lon_max}`);
        // console.log(`avg_lat: ${lat_avg} and avg_lon: ${lon_avg}`);
        // console.log(`dist_lat: ${lat_dst} and dist_lon: ${lon_dst}`);
        
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

        var layout = {
            title:'',
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
            width: 400,
            height: 300
          };

        // Plotly.newPlot("elevation",data,layout)
        let out = {
            lat_avg, lon_avg, zoom
        }
        cb(out)
    }
}