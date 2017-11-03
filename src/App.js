import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Scene.css';

import Tile from './Tile/Tile';

function Tiles(props) {
  return [...Array(props.nbOfTiles)].map((v, i) => {
    return <Tile
      key={i}
      position={i}
      total={props.nbOfTiles}
      source={props.source}
      sceneSize={props.sceneSize} />;
  });
}


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      nbOfTiles: 9,
      source: 'http://lorempixel.com/800/800/nature/3/',
      sceneSize: 600 // this needs to be dynamic
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>

        <div className="App-body">
          <div
            className="Scene"
            style={{ width: this.state.sceneSize }}>
            <Tiles
              nbOfTiles={this.state.nbOfTiles}
              source={this.state.source}
              sceneSize={this.state.sceneSize}/>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
