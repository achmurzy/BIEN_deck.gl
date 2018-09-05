import React, {Component} from 'react';
import MapGL from 'react-map-gl'

import taxiData from './../data/taxi';
import sampleGeoJSON from './../data/GeoJSON/example/sample.geo.json'
import exampleGeoJSON from './../data/GeoJSON/example/vancouver.json'
import abiesData from './../data/GeoJSON/Abies_grandis/range.json'
import DeckGLOverlay from './deckgl-overlay';
import Charts from './charts';

import {LayerControls, SCATTERPLOT_CONTROLS} from './layer-controls';
import {tooltipStyle} from './style';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

if (!MAPBOX_TOKEN) {
  alert('The mapbox token is not defined. Please export it in the terminal where you typed "npm start"')
}

export default class App extends Component {

  constructor(props) {
    super(props);
    this._resize = this._resize.bind(this);
    this.state = 
    {
      selectedHour: null,
      viewport: 
      {
        width: window.innerWidth,
        height: window.innerHeight,
        longitude: -122,
        latitude: 45,
        zoom:5,
        pitch: 30,
        maxZoom:16
      },
      currentTime: 0,
      settings: Object.keys(SCATTERPLOT_CONTROLS).reduce((accu, key) => ({
        ...accu,
        [key]: SCATTERPLOT_CONTROLS[key].value
      }), {}),
    };
  }

  _updateLayerSettings(settings)
  {
    this.setState({settings});
  }

  _onViewportChange(viewport)
  {
    this.setState({viewport: 
      {...this.state.viewport, ...viewport}
    });
  }
  componentDidMount()
  {
    //this._processData();
    window.addEventListener('resize', this._resize);
    this._resize();
  }
  componentWillUnmount()
  {
    window.removeEventListener('resize', this._resize);
  }

  _processData()
  {
    if(abiesData)
    {}
    else if (taxiData) {
      this.setState({status: 'LOADED'});
      const data = taxiData.reduce((accu, curr) => {

        const pickupHour = new Date(curr.pickup_datetime).getUTCHours();
        const dropoffHour = new Date(curr.dropoff_datetime).getUTCHours();

        const pickupLongitude = Number(curr.pickup_longitude);
        const pickupLatitude = Number(curr.pickup_latitude);

        if (!isNaN(pickupLongitude) && !isNaN(pickupLatitude)) {
          accu.points.push({
            position: [pickupLongitude, pickupLatitude],
            hour: pickupHour,
            pickup: true
          });
        }

        const dropoffLongitude = Number(curr.dropoff_longitude);
        const dropoffLatitude = Number(curr.dropoff_latitude);

        if (!isNaN(dropoffLongitude) && !isNaN(dropoffLatitude)) {
          accu.points.push({
            position: [dropoffLongitude, dropoffLatitude],
            hour: dropoffHour,
            pickup: false
          });
        }

        const prevPickups = accu.pickupObj[pickupHour] || 0;
        const prevDropoffs = accu.dropoffObj[dropoffHour] || 0;

        accu.pickupObj[pickupHour] = prevPickups + 1;
        accu.dropoffObj[dropoffHour] = prevDropoffs + 1;

        return accu;
      }, {
        points: [],
        pickupObj: {},
        dropoffObj: {}
      });

      data.pickups = Object.entries(data.pickupObj).map(([hour, count]) => {
        return {hour: Number(hour), x: Number(hour) + 0.5, y: count};
      });
      data.dropoffs = Object.entries(data.dropoffObj).map(([hour, count]) => {
        return {hour: Number(hour), x: Number(hour) + 0.5, y: count};
      });
      data.status = 'READY';

      this.setState(data);
    }
  }

  _resize()
  {
    this._onViewportChange({width: window.innerWidth, height: window.innerHeight});
  }

  _onHover({x,y,object}) 
  {
    this.setState({x, y, hoveredObject: object});
  }

  _onHighlight(highlightedHour)
  {
    this.setState({highlightedHour});
  }

  _onSelect(selectedHour)
  {
    this.setState({ selectedHour: selectedHour === this.state.selectedHour ? null : selectedHour});
  }

  render() {
    return (
      <div>
        {/*this.state.hoveredObject &&
            <div style = {{
              ...tooltipStyle,                                              //Listen close cause i only want to say this once
              transform: `translate(${this.state.x}px, ${this.state.y}px)`  //Use the fucking back-tick `` to embed expressions in string literals
            }}>                                                           
              <div>{JSON.stringify(this.state.hoveredObject)}</div>
            </div>
          */}
        {/*<LayerControls
          settings={this.state.settings}
          propTypes={SCATTERPLOT_CONTROLS}
          onChange={settings => this._updateLayerSettings(settings)}/>*/}
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange = {viewport => this._onViewportChange(viewport)}>
          
          <DeckGLOverlay
            //{...this.state.settings}
            viewport={this.state.viewport}
            data={abiesData}
            //data={this.state.points}
            //hour={this.state.highlightedHour || this.state.selectedHour}
            //onHover={hover => this._onHover(hover)} //Stores state information from mouse input
            //{...this.state.settings}
            />
        </MapGL>
        {/*<Charts {...this.state} //defines a 'highlight' function on the chart to do coloring based on interaction on this component
          highlight={hour => this._onHighlight(hour)}
          select={hour => this._onSelect(hour)}/>*/}
      </div>
    );
  }

  
}
