import React, { useState } from 'react';
import getGpxParameters from '../../calculations/getGpxParameters';

// https://github.com/plotly/react-plotly.js/issues/135#issuecomment-500399098
import createPlotlyComponent from 'react-plotly.js/factory';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);


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



export function ElevationPlot(props){

    const {gpxFile,gpxFileName,plotSize,sampleSize,sampleSize2} = props;

    let gpxParams = null
    getGpxParameters(gpxFile,gpxFileName,out =>{
        gpxParams = out
    })

    const {
      sumDist,
      // zoom,
      // data,
      // speedData,
      envelopeElevations,
      avgElevations,
      elevations
    } = gpxParams;

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

    const data = [trace3]

    return(
        <React.Fragment>
          {/*--------ELEVATION PLOT ------------*/}
                  
          {gpxParams && <Plot
                      data={data}
                      layout={layout(plotSize.f)}
                      config={{displayModeBar: true}}
                  />}
        </React.Fragment>
    )
}