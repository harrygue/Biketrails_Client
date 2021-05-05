import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from "react-router-dom";
import 'leaflet/dist/leaflet.css'
import {BiketrailsProvider} from './context/biketrails.context'
import { CookiesProvider } from 'react-cookie';

ReactDOM.render(
  <BrowserRouter>
    <BiketrailsProvider>
      <CookiesProvider>
        <App />
      </CookiesProvider>
    </BiketrailsProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
