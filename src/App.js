import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './Header'
import Footer from './Footer'
import DeckContainer from './Deck-Container'

import Bootstrap from 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      	<Header/>
        <DeckContainer/>
        <Footer/>
      </div>
    );
  }
}

export default App;
