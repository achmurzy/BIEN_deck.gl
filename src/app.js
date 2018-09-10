import React, {Component} from 'react';
import MapGL from 'react-map-gl'

import taxiData from './../data/taxi';
import sampleGeoJSON from './../data/GeoJSON/example/sample.geo.json'
import exampleGeoJSON from './../data/GeoJSON/example/vancouver.json'
import abiesData from './../data/GeoJSON/Abies_grandis/range.json'
import DeckGLOverlay from './deckgl-overlay';
import Charts from './charts';
import Dropdown from './dropdown'

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
      speciesData: [],
      occurrenceData: [],
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
    this.fetchSpecies();
    //this.fetchOccurrences();
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  fetchSpecies()
  {
    /*fetch('http://localhost:1337/species/list', {method: 'GET', headers: {"Access-Control-Allow-Origin": "*"}}).then(results => 
    { 
      return results.json(); 
    }).then(data => 
      {
        console.log(data);
        let speciesData = data.rows.map((spp) => {
          if(spp.species == null)
          {
            return null;
          }
          else
          {
            return { id: spp.id, species: spp.species };
          }
        });
        this.setState({speciesData: speciesData});
      });*/
      this.setState({speciesData: [
      {
          id: 0,
          title: 'New York',
          selected: false,
          key: 'location'
      },
      {
        id: 1,
        title: 'Dublin',
        selected: false,
        key: 'location'
      },
      {
        id: 2,
        title: 'California',
        selected: false,
        key: 'location'
      },
      {
        id: 3,
        title: 'Istanbul',
        selected: false,
        key: 'location'
      },
      {
        id: 4,
        title: 'Izmir',
        selected: false,
        key: 'location'
      },
      {
        id: 5,
        title: 'Oslo',
        selected: false,
        key: 'location'
      }
    ]});
  }  

  fetchOccurrences()
  {
    fetch('http://localhost:1337/occurrence/list', {method: 'GET', headers: {"Access-Control-Allow-Origin": "*"}}).then(results => 
    { 
      return results.json(); 
    }).then(data => 
      {
        console.log(data);
        let occurrenceData = data.rows.map((occurrence) => {
          if(occurrence.latitude == null || occurrence.longitude == null)
          {
            return { latitude: null, longitude: null }
          }
          else
          {
            return { latitude: parseFloat(occurrence.latitude), longitude: parseFloat(occurrence.longitude) }
          }
        });
        this.setState({occurrenceData: occurrenceData});
      });
  }

  componentWillUnmount()
  {
    window.removeEventListener('resize', this._resize);
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
        <Dropdown title = "Select species"
                    list = {this.state.speciesData}/>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange = {viewport => this._onViewportChange(viewport)}>
          
          <DeckGLOverlay
            //{...this.state.settings}
            viewport={this.state.viewport}
            rangeData={abiesData}
            occurrenceData={this.state.occurrenceData}
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
