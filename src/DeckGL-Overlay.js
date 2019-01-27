import React, {Component} from 'react';
import DeckGL from 'deck.gl';
import {scaleThreshold} from 'd3-scale';

import RangeLayer from './Range-Layer';
import OccurrenceLayer from './Occurrence-Layer';

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

    const layers = [
        new OccurrenceLayer({
          id: 'occurrence-layer',
          data: this.props.occurrenceData,
          getPosition: d => [d.longitude, d.latitude],
          getColor: d => PICKUP_COLOR,
          getRadius: d => 10000
        }),
        new RangeLayer({
        id: 'geojson',
        data: this.props.rangeData,
        opacity: 1.0,
        stroked: true,
        filled: true,
        extruded: true,
        wireframe: false,
        fp64: true,
        getLineColor: [255, 255, 255],
        getFillColor: [255, 0, 0, 255],
        lightSettings: LIGHT_SETTINGS,
        pickable: true
        })
    ];

    return <DeckGL {...this.props.viewport} 
                    layers={layers}
                    //onWebGLInitialized={this._initialize}
                    />;
  }
}