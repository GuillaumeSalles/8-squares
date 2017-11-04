import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Scene.css';

import Tile from './Tile/Tile';
import testImg from './test-img-2.jpg';

function Tiles(props) {
    return [0, 1, 2, 3, 4, 5, 6, 7, -1].map((v, i) => {
        return (
            <Tile
                key={i}
                position={i}
                originalPosition={v}
                total={props.nbOfTiles}
                source={props.source}
                sceneMaxSize={props.sceneMaxSize}
            />
        );
    });
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nbOfTiles: 9,
            source: testImg,
            sceneMaxSize: 1024 // this needs to be dynamic
        };
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                </header>

                <div className="App-body">
                    <div className="Scene" style={{ maxWidth: this.state.sceneMaxSize }}>
                        <div className="Scene-content">
                            <Tiles
                                nbOfTiles={this.state.nbOfTiles}
                                source={this.state.source}
                                sceneMaxSize={this.state.sceneMaxSize}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
