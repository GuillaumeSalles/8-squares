import React, { Component } from 'react';
import './Scene.css';
import Tile from './Tile/Tile';
import images from './Images.js';

const gridSize = 3;
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const NONE = -1;

function areTilesOrdered(tiles) {
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
            return NONE;
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

    return NavigationEvent;
}

function move(tiles, direction) {
    const emptyTilePosition = tiles[tiles.length - 1].position;
    switch (direction) {
        case RIGHT:
            return emptyTilePosition % gridSize > 0 ? swap(tiles, emptyTilePosition, emptyTilePosition - 1) : tiles;
        case LEFT:
            return emptyTilePosition % gridSize < gridSize - 1
                ? swap(tiles, emptyTilePosition, emptyTilePosition + 1)
                : tiles;
        case UP:
            return emptyTilePosition / gridSize < gridSize - 1
                ? swap(tiles, emptyTilePosition, emptyTilePosition + gridSize)
                : tiles;
        case DOWN:
            return emptyTilePosition / gridSize >= 1
                ? swap(tiles, emptyTilePosition, emptyTilePosition - gridSize)
                : tiles;
        default:
            return tiles;
    }
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
    return shuffle(tiles, 3);
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sceneMaxSize: 600, // this needs to be dynamic,
            tiles: initTiles(gridSize * gridSize),
            startingX: null,
            startingY: null,
            imageIndex: getRandomInt(0, images.length)
        };

        this.handleTileTouchStart = this.handleTileTouchStart.bind(this);
        this.handleTileTouchEnd = this.handleTileTouchEnd.bind(this);
        this.handleNewGameClick = this.handleNewGameClick.bind(this);

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

    handleNewGameClick() {
        this.setState({
            tiles: initTiles(gridSize * gridSize),
            imageIndex: (this.state.imageIndex + 1) % images.length
        });
    }

    render() {
        const hasWon = areTilesOrdered(this.state.tiles);
        return (
            <div
                className="Scene"
                style={{ maxWidth: this.state.sceneMaxSize }}
                onTouchStart={this.handleTileTouchStart}
                onTouchEnd={this.handleTileTouchEnd}
            >
                <div className="Scene-content">{this.renderTiles()}</div>
                <div className="Winning-screen" style={{ transition: hasWon ? '' : 'none', opacity: hasWon ? 1 : 0 }}>
                    <img className="Full-image" src={images[this.state.imageIndex].src} />
                    <a className="Origin-link" href={images[this.state.imageIndex].origin}>
                        By {images[this.state.imageIndex].author}
                    </a>
                    <button className="New-game-button" onClick={this.handleNewGameClick}>
                        New Game
                    </button>
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
                    isVisible={i !== this.state.tiles.length - 1}
                    originalPosition={i}
                    gridSize={gridSize}
                    source={images[this.state.imageIndex].src}
                    sceneMaxSize={this.state.sceneMaxSize}
                />
            );
        });
    }
}

export default Game;
