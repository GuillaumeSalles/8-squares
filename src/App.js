import React, { Component } from 'react';
import './App.css';
import './Scene.css';

import Tile from './Tile/Tile';
//import testImg from './test-img-2.jpg';
import images from './Images.js';
const testImg = images[0].url;

const nbOfColumns = 3;
const nbOfRows = 3;
const EMPTY_TILE = -1;

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

function hasWon(tiles) {
    for (let i = 0; i < tiles.length; i++) {
        if (i !== tiles[i].position) {
            return false;
        }
    }
    return true;
}

function keyToDirection(key) {
    switch (key) {
        case 'ArrowDown':
            return DOWN;
        case 'ArrowUp':
            return UP;
        case 'ArrowLeft':
            return LEFT;
        case 'ArrowRight':
            return RIGHT;
        default:
            return 'NONE';
    }
}

function getSwipeDirection(startX, startY, endX, endY) {
    const offsetX = endX - startX;
    const offsetY = endY - startY;
    if (Math.abs(offsetX) > Math.abs(offsetY)) {
        if (offsetX > 25) {
            return RIGHT;
        } else if (offsetX < -25) {
            return LEFT;
        }
    } else {
        if (offsetY > 25) {
            return DOWN;
        } else if (offsetY < -25) {
            return UP;
        }
    }

    return 'NONE';
}

function move(tiles, direction) {
    const emptyTilePosition = tiles[tiles.length - 1].position;
    switch (direction) {
        case 'NONE':
            return tiles;
        case RIGHT:
            return canMoveRight(tiles, emptyTilePosition)
                ? swap(tiles, emptyTilePosition, emptyTilePosition - 1)
                : tiles;
        case LEFT:
            return canMoveLeft(tiles, emptyTilePosition)
                ? swap(tiles, emptyTilePosition, emptyTilePosition + 1)
                : tiles;
        case UP:
            return canMoveUp(tiles, emptyTilePosition)
                ? swap(tiles, emptyTilePosition, emptyTilePosition + nbOfColumns)
                : tiles;
        case DOWN:
            return canMoveDown(tiles, emptyTilePosition)
                ? swap(tiles, emptyTilePosition, emptyTilePosition - nbOfColumns)
                : tiles;
        default:
            return tiles;
    }
}

function canMoveRight(tiles, emptyTilePosition) {
    return emptyTilePosition % nbOfColumns > 0;
}

function canMoveLeft(tiles, emptyTilePosition) {
    return emptyTilePosition % nbOfColumns < nbOfColumns - 1;
}

function canMoveUp(tiles, emptyTilePosition) {
    return emptyTilePosition / nbOfRows < nbOfRows - 1;
}

function canMoveDown(tiles, emptyTilePosition) {
    return emptyTilePosition / nbOfRows >= 1;
}

function swap(tiles, a, b) {
    return tiles.map(tile => {
        if (tile.position === a) {
            tile.position = b;
        } else if (tile.position === b) {
            tile.position = a;
        }
        return tile;
    });
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function shuffle(tiles, nbOfTimes) {
    for (var i = 0; i < nbOfTimes; i++) {
        const direction = getRandomInt(0, 4);
        tiles = move(tiles, direction);
    }
    return tiles;
}

function initTiles(nbOfTiles) {
    const tiles = [];
    for (let i = 0; i < nbOfTiles; i++) {
        tiles.push({ position: i });
    }
    return shuffle(tiles, 80);
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nbOfTiles: 9,
            source: testImg,
            sceneMaxSize: 1024, // this needs to be dynamic,
            tiles: initTiles(nbOfColumns * nbOfRows),
            startingX: null,
            startingY: null
        };

        this.handleTileTouchStart = this.handleTileTouchStart.bind(this);
        this.handleTileTouchEnd = this.handleTileTouchEnd.bind(this);
        window.addEventListener('keydown', ev => {
            this.setState({
                tiles: move(this.state.tiles, keyToDirection(ev.key))
            });
        });
    }

    handleTileTouchStart(e) {
        this.setState({
            startingX: e.touches[0].clientX,
            startingY: e.touches[0].clientY
        });
    }

    handleTileTouchEnd(e) {
        const direction = getSwipeDirection(
            this.state.startingX,
            this.state.startingY,
            e.changedTouches[0].clientX,
            e.changedTouches[0].clientY
        );

        this.setState({
            tiles: move(this.state.tiles, direction),
            startingX: null,
            startingY: null
        });
    }

    render() {
        if (hasWon(this.state.tiles)) {
            console.log('You won!');
        }

        return (
            <div className="App">
                <div className="App-body">
                    <div
                        className="Scene"
                        style={{ maxWidth: this.state.sceneMaxSize }}
                        onTouchStart={this.handleTileTouchStart}
                        onTouchEnd={this.handleTileTouchEnd}
                    >
                        <div className="Scene-content">{this.renderTiles()}</div>
                    </div>
                </div>
            </div>
        );
    }

    renderTiles() {
        return this.state.tiles.map((tile, i) => {
            return (
                <Tile
                    key={i}
                    position={tile.position}
                    originalPosition={i === this.state.tiles.length - 1 ? EMPTY_TILE : i}
                    total={this.state.tiles.length}
                    source={this.state.source}
                    sceneMaxSize={this.state.sceneMaxSize}
                />
            );
        });
    }
}

export default App;
