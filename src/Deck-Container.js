import React, {Component} from 'react';
import MapGL from 'react-map-gl'

import bien from './resources/images/BIEN.png'
import azure from './resources/images/Azure.png'
import ci from './resources/images/CI.png'
import nceas from './resources/images/NCEAS.png'
import cyverse from './resources/images/CyVerse.png'

import richness from './resources/data/richquery.json'

import DeckGLOverlay from './DeckGL-Overlay';
import {LayerControls, SCATTERPLOT_CONTROLS} from './Layer-Controls';
import SpeciesDropdown from './SpeciesDropdown';

const MAPBOX_STYLE = 'mapbox://styles/mapbox/dark-v9';
const MAPBOX_TOKEN = "pk.eyJ1IjoiaDRjazNyZDR3ZyIsImEiOiJjamtyNzk5ZDMzcXViM2tueDYxY2lhN3plIn0.1iCq_sXdot3tVg0Fi-KppQ"
                      //process.env.MapboxAccessToken; // eslint-disable-line

if (!MAPBOX_TOKEN) {
  alert('The mapbox token is not defined. Please export it in the terminal where you typed "npm start"')
}

export default class DeckContainer extends Component {

  constructor(props) {
    super(props);
    this._resize = this._resize.bind(this);
    this.selectSpecies = this.selectSpecies.bind(this);
    this.matchSpecies = this.matchSpecies.bind(this);
    this.state = 
    {
      speciesData: [],
      selectedSpecies: 'Mimetanthe pilosa',
      occurrenceData: [],
      richnessData: richness,
      rangeData: [],
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
    this.fetchOccurrences();
    this.fetchRange();
    console.log(richness)
    window.addEventListener('resize', this._resize);
    this._resize();
  }

  selectSpecies(species)
  {
    this.setState({selectedSpecies: species}, () => {this.fetchOccurrences(); this.fetchRange(); });
  }

  fetchSpecies()
  {
    fetch('http://localhost:5000/species', {method: 'GET', headers: {"Access-Control-Allow-Origin": "*"}}).then(results => 
    { 
      return results.json(); 
    }).then(data => 
      {
        let speciesData = data.map((spp) => {
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
      });
  }

  matchSpecies(substringSpecies)
  {
    fetch('http://localhost:5000/species/'+"?species="+substringSpecies.replace(" ", "_"), 
      {method: 'GET', headers: {"Access-Control-Allow-Origin": "*"}}).then(results => 
    { 
      return results.json(); 
    }).then(data => 
      {
        let speciesData = data.map((spp) => {
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
      });
  }  

  fetchOccurrences()
  {
    fetch('http://localhost:5000/occurrences/'+"?species="+this.state.selectedSpecies.replace(" ","_"), 
      {method: 'GET', headers: {"Access-Control-Allow-Origin": "*"}})
    .then(results => 
    { 
      return results.json(); 
    }).then(data => 
      {
        let occurrenceData = data.map((occurrence) => {
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

  fetchRange()
  {
    fetch('http://localhost:5000/ranges/'+"?species="+this.state.selectedSpecies.replace(" ","_"), 
      {method: 'GET', headers: {"Access-Control-Allow-Origin": "*"}})
    .then(results => 
    { 
      return results.json(); 
    }).then(data => 
      {
        var geojson = JSON.parse(data)
        this.setState({rangeData: geojson});
      }); 
  }

  componentWillUnmount()
  {
    window.removeEventListener('resize', this._resize);
  }

  _resize()
  {
    this._onViewportChange({width: window.innerWidth, height: window.innerHeight-150});
  }

  _onHover({x,y,object}) 
  {
    this.setState({x, y, hoveredObject: object});
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
        <SpeciesDropdown title = "Select species"
                  list = {this.state.speciesData}
                  select = {this.selectSpecies}
                  match = {this.matchSpecies}/>
        <MapGL
          {...this.state.viewport}
          mapStyle={MAPBOX_STYLE}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          onViewportChange = {viewport => this._onViewportChange(viewport)}>
          
          <DeckGLOverlay
            //{...this.state.settings}
            viewport={this.state.viewport}
            rangeData={this.state.rangeData}
            occurrenceData={this.state.occurrenceData}
            richnessData={this.state.richnessData}
            //{...this.state.settings}
          />
          <p className="App-logo-container">
            <a href="http://bien.nceas.ucsb.edu/bien/biendata/bien-4/"><img src={bien} className="App-logo-left" alt="logo"/></a>
            {/*<a href="https://www.nceas.ucsb.edu/"><img src={nceas} className="App-logo-left" alt="logo"/></a>*/}
            {/*<a href="https://www.cyverse.org/about"><img src={cyverse} className="App-logo" alt="logo"/></a>*/}
            {/*<a href="https://www.conservation.org/Pages/default.aspx"><img src={ci} className="App-logo" alt="logo"/></a>*/}
            <a href="https://www.microsoft.com/en-us/ai-for-earth"><img src={azure} className="App-logo-right" alt="logo"/></a>
          </p>
        </MapGL>
      </div>
    );
  }

  
}
