import React, { Component } from 'react';
import './App.css';
import './Scene.css';

import Tile from './Tile/Tile';
//import testImg from './test-img-2.jpg';
import images from './Images.js';
const testImg = images[0].url;

const nbOfColumns = 4;
const nbOfRows = 4;
const EMPTY_TILE = -1;

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
    return index % nbOfColumns < nbOfColumns - 1 && tiles[index + 1] === EMPTY_TILE;
}

function canMoveLeft(tiles, index) {
    return index % nbOfColumns > 0 && tiles[index - 1] === EMPTY_TILE;
}

function canMoveUp(tiles, index) {
    return index / nbOfRows !== 0 && tiles[index - nbOfColumns] === EMPTY_TILE;
}

function canMoveDown(tiles, index) {
    return index / nbOfRows !== nbOfRows - 1 && tiles[index + nbOfColumns] === EMPTY_TILE;
}

function hadSwipeEnough(state, tileSize) {
    const tileIndex = state.tiles.indexOf(state.draggedTile);

    switch (getSwipeDirection(state.tiles, tileIndex)) {
        case 'UP':
            return getUpOffset(state, tileSize) < -100 / nbOfColumns;
        case 'DOWN':
            return getDownOffset(state, tileSize) > 100 / nbOfColumns;
        case 'RIGHT':
            return getRightOffset(state, tileSize) > 100 / nbOfColumns;
        case 'LEFT':
            return getLeftOffset(state, tileSize) < -100 / nbOfColumns;
        case 'NONE':
        default:
            return false;
    }
}

function getTransform(state, tile, tileSize) {
    const tileIndex = state.tiles.indexOf(tile);
    switch (getSwipeDirection(state.tiles, tileIndex)) {
        case 'UP':
            return `translate(0%, ${getUpOffset(state, tileSize)}%)`;
        case 'DOWN':
            return `translate(0%, ${getDownOffset(state, tileSize)}%)`;
        case 'RIGHT':
            return `translate(${getRightOffset(state, tileSize)}%, 0%)`;
        case 'LEFT':
            return `translate(${getLeftOffset(state, tileSize)}%, 0%)`;
        case 'NONE':
        default:
            return '';
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

function getLeftOffset(state, tileSize) {
    return Math.max(Math.min((state.currentX - state.startingX) / tileSize * 300, 0), -100);
}

function getRightOffset(state, tileSize) {
    return Math.max(Math.min((state.currentX - state.startingX) / tileSize * 300, 100), 0);
}

function getUpOffset(state, tileSize) {
    return Math.max(Math.min((state.currentY - state.startingY) / tileSize * 300, 0), -100);
}

function getDownOffset(state, tileSize) {
    return Math.max(Math.min((state.currentY - state.startingY) / tileSize * 300, 100), 0);
}

function getTileElement(target) {
    while (target != null) {
        if (target.attributes['tile'] != null) {
            return target;
        }
        target = target.parentElement;
    }

    return null;
}

function getTileValue(target) {
    const element = getTileElement(target);
    return element === null ? null : parseInt(element.attributes['tile'].value);
}

function initTiles(nbOfTiles) {
    const tiles = [];
    for (let i = 0; i < nbOfTiles - 1; i++) {
        tiles.push(i);
    }
    tiles.push(EMPTY_TILE);
    return tiles;
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nbOfTiles: 9,
            source: testImg,
            sceneMaxSize: 1024, // this needs to be dynamic,
            tiles: initTiles(nbOfColumns * nbOfRows),
            draggedTile: null,
            startingX: null,
            startingY: null,
            currentX: null,
            currentY: null,
            transform: null
        };

        this.handleTileTouchStart = this.handleTileTouchStart.bind(this);
        this.handleTileTouchEnd = this.handleTileTouchEnd.bind(this);
        this.handleTileTouchMove = this.handleTileTouchMove.bind(this);
    }

    handleTileTouchMove(e) {
        if (this.state.draggedTile === null) {
            return;
        }

        this.setState({
            currentX: e.touches[0].clientX,
            currentY: e.touches[0].clientY,
            transform: getTransform(this.state, this.state.draggedTile, getTileElement(e.target).offsetWidth)
        });
    }

    handleTileTouchStart(e) {
        const tile = getTileValue(e.target);
        if (tile === null || tile === EMPTY_TILE) {
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
            tiles: hadSwipeEnough(this.state, getTileElement(e.target).offsetWidth)
                ? swap(this.state)
                : this.state.tiles,
            draggedTile: null,
            startingX: null,
            startingY: null,
            currentX: null,
            currentY: null,
            transform: null
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-body">
                    <div
                        className="Scene"
                        style={{ maxWidth: this.state.sceneMaxSize }}
                        onTouchStart={this.handleTileTouchStart}
                        onTouchEnd={this.handleTileTouchEnd}
                        onTouchMove={this.handleTileTouchMove}
                    >
                        <div className="Scene-content">{this.renderTiles()}</div>
                    </div>
                </div>
            </div>
        );
    }

    renderTiles() {
        return this.state.tiles.map((v, i) => {
            return (
                <div key={i} tile={v}>
                    <Tile
                        key={i}
                        position={i}
                        originalPosition={v}
                        dragTransform={this.state.draggedTile === v ? this.state.transform : ''}
                        total={this.state.tiles.length}
                        source={this.state.source}
                        sceneMaxSize={this.state.sceneMaxSize}
                    />
                </div>
            );
        });
    }
}

export default App;
