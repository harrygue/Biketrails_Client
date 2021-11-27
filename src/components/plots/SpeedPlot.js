import React, { useState } from 'react';
import getGpxParameters from '../../calculations/getGpxParameters';

// https://github.com/plotly/react-plotly.js/issues/135#issuecomment-500399098
import createPlotlyComponent from 'react-plotly.js/factory';

const Plotly = window.Plotly;
const Plot = createPlotlyComponent(Plotly);

const layoutSpeedPlot = (f) =>{
  return {
      title:'Speed',
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
          title: 'Speed [km/h]',
          showgrid: true,
          zeroline: true
      },
      width: 400*f,
      height: 300*f
    }
}

export function SpeedPlot(props){

  const {gpxFile,gpxFileName,plotSize,sampleSize,sampleSize2} = props;

  let gpxParams = null
  getGpxParameters(gpxFile,gpxFileName,out =>{
      gpxParams = out
  })

  const {
    sumDist,
    // zoom,
    // data,
    speedpoints,
  } = gpxParams;

  let traceSpeed = {
    x: sumDist,
    y: speedpoints,
    mode: "lines",
    line: {
      color: 'rgb(57, 252, 3)',
      width: 2,
      dash:'line'
    }
};

let speedData = [traceSpeed];

  return(
    <React.Fragment>
      {gpxParams && <Plot
        data={speedData}
        layout={layoutSpeedPlot(plotSize.f)}
        config={{displayModeBar: true}}
      />}
    </React.Fragment>
  )
}
