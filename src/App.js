import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import './Scene.css';

import Tile from './Tile/Tile';
import testImg from './test-img-2.jpg';

function getSwipeDirection(tiles, index) {
    if (canMoveDown(tiles, index)) {
        return 'DOWN';
    }

    if (canMoveUp(tiles, index)) {
        return 'UP';
    }

    if (canMoveLeft(tiles, index)) {
        return 'LEFT';
    }

    if (canMoveRight(tiles, index)) {
        return 'RIGHT';
    }

    return 'NONE';
}

function canMoveRight(tiles, index) {
    return index % 3 < 2 && tiles[index + 1] === -1;
}

function canMoveLeft(tiles, index) {
    return index % 3 > 0 && tiles[index - 1] === -1;
}

function canMoveUp(tiles, index) {
    return index > 2 && tiles[index - 3] === -1;
}

function canMoveDown(tiles, index) {
    return index < 6 && tiles[index + 3] === -1;
}

function hadSwipeEnough(state) {
    const tileIndex = state.tiles.indexOf(state.draggedTile);

    switch (getSwipeDirection(state.tiles, tileIndex)) {
        case 'UP':
            return getOffsetY(state, tileIndex) < -33;
        case 'DOWN':
            return getOffsetY(state, tileIndex) > 33;
        case 'RIGHT':
            return getOffsetX(state, tileIndex) > 33;
        case 'LEFT':
            return getOffsetX(state, tileIndex) < -33;
        case 'NONE':
            return false;
    }
}

function swap(state) {
    return state.tiles.map((val, index, arr) => {
        if (val === state.draggedTile) {
            return -1;
        } else if (val === -1) {
            return state.draggedTile;
        } else {
            return val;
        }
    });
}

function getTransform(state, tile) {
    if (state.draggedTile !== tile) {
        return 'translate(0%, 0%)';
    }

    const tileIndex = state.tiles.indexOf(tile);

    const offsetX = getOffsetX(state, tileIndex);
    const offsetY = getOffsetY(state, tileIndex);
    return `translate(${offsetX}%, ${offsetY}%)`;
}

function getOffsetX(state, tileIndex) {
    if (canMoveRight(state.tiles, tileIndex)) {
        return Math.max(
            Math.min((state.currentX - state.startingX) / window.innerWidth * 300, 100),
            0
        );
    }

    if (canMoveLeft(state.tiles, tileIndex)) {
        return Math.max(
            Math.min((state.currentX - state.startingX) / window.innerWidth * 300, 0),
            -100
        );
    }

    return 0;
}

function getOffsetY(state, tileIndex) {
    if (canMoveDown(state.tiles, tileIndex)) {
        return Math.max(
            Math.min((state.currentY - state.startingY) / window.innerHeight * 300, 100),
            0
        );
    }

    if (canMoveUp(state.tiles, tileIndex)) {
        return Math.max(
            Math.min((state.currentY - state.startingY) / window.innerHeight * 300, 0),
            -100
        );
    }

    return 0;
}

function getTileValueFromTarget(target) {
    while (target != null) {
        if (target.attributes['name'] != null) {
            return parseInt(target.attributes['name'].value);
        }
        target = target.parentElement;
    }

    return null;
}

function initTiles(nbOfTiles) {
    const tiles = [];
    for (let i = 0; i < nbOfTiles - 1; i++) {
        tiles.push(i);
    }
    return tiles.concat([-1]);
}

function Tiles(props) {
    return initTiles(props.nbOfTiles).map((v, i) => {
        return (
            <div key={i} name={i.toString()}>
                <Tile
                    key={i}
                    position={i}
                    total={props.nbOfTiles}
                    source={props.source}
                    sceneMaxSize={props.sceneMaxSize}
                />
            </div>
        );
    });
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nbOfTiles: 9,
            source: testImg,
            sceneMaxSize: 1024, // this needs to be dynamic,
            draggedTile: null,
            startingX: null,
            startingY: null,
            currentX: null,
            currentY: null
        };

        this.handleTileTouchStart = this.handleTileTouchStart.bind(this);
        this.handleTileTouchEnd = this.handleTileTouchEnd.bind(this);
        this.handleTileTouchMove = this.handleTileTouchMove.bind(this);
    }

    handleTileTouchMove(e) {
        if (this.state.draggedTile !== null) {
            this.setState({
                currentX: e.touches[0].clientX,
                currentY: e.touches[0].clientY
            });
        }
    }

    handleTileTouchStart(e) {
        const tile = getTileValueFromTarget(e.target);
        if (tile === null || tile === -1) {
            return;
        }

        this.setState({
            draggedTile: tile,
            startingX: e.touches[0].clientX,
            startingY: e.touches[0].clientY,
            currentX: e.touches[0].clientX,
            currentY: e.touches[0].clientY
        });
    }

    handleTileTouchEnd(e) {
        if (this.state.draggedTile === null) {
            return;
        }

        this.setState({
            tiles: hadSwipeEnough(this.state) ? swap(this.state) : this.state.tiles,
            draggedTile: null,
            startingX: null,
            startingY: null,
            currentX: null,
            currentY: null
        });
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
                        style={{ maxWidth: this.state.sceneMaxSize }}
                        onTouchStart={this.handleTileTouchStart}
                        onTouchEnd={this.handleTileTouchEnd}
                        onTouchMove={this.handleTileTouchMove}
                    >
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
