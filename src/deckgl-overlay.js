import React, {Component} from 'react';
import DeckGL, {ScatterplotLayer, HexagonLayer, GeoJsonLayer} from 'deck.gl';
import {scaleThreshold} from 'd3-scale';


import TaxiLayer from './taxi-layer';
import TaxiClusterLayer from './taxi-cluster-layer';
import MyScatterplotLayer from './my-scatterplot-layer';
import RangeLayer from './range-layer';

const PICKUP_COLOR = [0, 128, 255];
const DROPOFF_COLOR = [255, 0, 128];

const HEATMAP_COLORS = [
  [213, 62, 79],
  [252, 141, 89],
  [254, 224, 139],
  [230, 245, 152],
  [153, 213, 148],
  [50, 136, 189]
].reverse();

const LIGHT_SETTINGS = {
  lightsPosition: [-73.8, 40.5, 8000, -74.2, 40.9, 8000],
  ambientRatio: 0.4,
  diffuseRatio: 0.6,
  specularRatio: 0.2,
  lightsStrength: [0.8, 0.0, 0.8, 0.0],
  numberOfLights: 2
};

const elevationRange = [0, 1000];

export const COLOR_SCALE = scaleThreshold()
  .domain([-0.6, -0.45, -0.3, -0.15, 0, 0.15, 0.3, 0.45, 0.6, 0.75, 0.9, 1.05, 1.2])
  .range([
    [65, 182, 196],
    [127, 205, 187],
    [199, 233, 180],
    [237, 248, 177],
    // zero
    [255, 255, 204],
    [255, 237, 160],
    [254, 217, 118],
    [254, 178, 76],
    [253, 141, 60],
    [252, 78, 42],
    [227, 26, 28],
    [189, 0, 38],
    [128, 0, 38]
  ]);

export default class DeckGLOverlay extends Component {
  _initialize(gl) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
  }

  render() {
    if (!this.props.data) {
      return null;
    }
    //const filteredData = this.props.hour === null ?
    //  this.props.data : this.props.data.filter(d => d.hour === this.props.hour);

    const layers = [
            new RangeLayer({
        id: 'geojson',
        data: this.props.data,
        opacity: 1.0,
        stroked: true,
        filled: true,
        extruded: true,
        wireframe: false,
        fp64: true,
        //getElevation: f => Math.sqrt(f.properties.valuePerSqm) * 10,
        getLineColor: [255, 255, 255],
        getFillColor: [255, 0, 0, 255],
        lightSettings: LIGHT_SETTINGS,
        pickable: true
        }),
      /*new TaxiLayer({
        id: 'taxi-trips',
        data: this.props.data,
        pickupColor: PICKUP_COLOR,
        dropoffColor: DROPOFF_COLOR,
        //getPickupLocation: d => d.position,
        //getDropoffLocation: d => d.position
        getPickupLocation: d => [d.pickup_longitude, d.pickup_latitude],
        getDropoffLocation: d => [d.dropoff_longitude, d.dropoff_latitude]
      }),*/
      /*new TaxiClusterLayer({
        id: 'taxi-trips',
        data: this.props.data,
        pickupColor: PICKUP_COLOR,
        dropoffColor: DROPOFF_COLOR,
        getPickupLocation: d => [d.pickup_longitude, d.pickup_latitude],
        getDropoffLocation: d => [d.dropoff_longitude, d.dropoff_latitude]
      })*/
      /*new MyScatterplotLayer({
        id: 'pickup',
        data: this.props.data,
        timeOfDay: (Date.now() / 1000) % 24,
        getPosition: d => [d.pickup_longitude, d.pickup_latitude],
        getColor: d => PICKUP_COLOR,
        getAngle: d => Math.atan2(d.dropoff_latitude - d.pickup_latitude, d.dropoff_longitude - d.pickup_longitude),
        getTime: d => { const pickupDate = new Date(d.pickup_datetime);
          return pickupDate.getUTCHours() + pickupDate.getMinutes() / 60; },
        radiusScale: 40
      })*/
      /*!this.props.showHexagon ? new ScatterplotLayer({
        id: 'scatterplot',
        getPosition: d => d.position,
        getColor: d => d.pickup ? PICKUP_COLOR : DROPOFF_COLOR,
        getRadius: d => 5,
        opacity: 0.5, 
        pickable: false,
        radiusScale: 5,
        radiusMinPixels: 0.25,
        radiusMaxPixels: 30,
        ...this.props,
        data: filteredData
      }) :null,   //Other layers go here, each as a React component with own set of properties
      this.props.showHexagon ? new HexagonLayer({
        id: 'heatmap',
        colorRange: HEATMAP_COLORS,
        elevationRange,
        elevationScale: 5,
        extruded:true,
        getPosition: d => d.position,
        lightSettings: LIGHT_SETTINGS,
        opacity: 1,
        pickable: true,
        radius: 300,
        ...this.props,
        data: filteredData
      }) : null,*/
    ];

    return <DeckGL {...this.props.viewport} 
                    layers={layers}
                    //onWebGLInitialized={this._initialize}
                    />;
  }
}