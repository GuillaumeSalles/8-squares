import React, { Component } from 'react';
import './App.css';
import Tile from './Tile';
import images from './Images';

const gridSize = 3;
const nbOfTiles = gridSize * gridSize;
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;
const NONE = -1;
const shuffleCount = 80;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
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

    return NONE;
}

function canMove(emptyTilePosition, direction) {
    switch (direction) {
        case RIGHT:
            return emptyTilePosition % gridSize > 0;
        case LEFT:
            return emptyTilePosition % gridSize < gridSize - 1;
        case UP:
            return emptyTilePosition / gridSize < gridSize - 1;
        case DOWN:
            return emptyTilePosition / gridSize >= 1;
        case NONE:
        default:
            return false;
    }
}

function getTileToMove(emptyTilePosition, direction) {
    switch (direction) {
        case RIGHT:
            return emptyTilePosition - 1;
        case LEFT:
            return emptyTilePosition + 1;
        case UP:
            return emptyTilePosition + gridSize;
        case DOWN:
            return emptyTilePosition - gridSize;
        default:
            throw new Error('Invalid direction');
    }
}

function swap(tiles, a, b) {
    return tiles.map(tile => {
        if (tile === a) {
            return b;
        } else if (tile === b) {
            return a;
        }
        return tile;
    });
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sceneMaxSize: 600,
            tiles: this.initTiles(),
            startingX: null,
            startingY: null,
            imageIndex: getRandomInt(0, images.length),
            isTutorialVisible: true
        };

        this.handleTileTouchStart = this.handleTileTouchStart.bind(this);
        this.handleTileTouchEnd = this.handleTileTouchEnd.bind(this);
        this.handleNewGameClick = this.handleNewGameClick.bind(this);

        window.addEventListener('keydown', ev => {
            this.tryToMove(keyToDirection(ev.key));
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

        this.tryToMove(direction);
    }

    handleNewGameClick() {
        this.setState({
            tiles: this.initTiles(gridSize * gridSize),
            imageIndex: (this.state.imageIndex + 1) % images.length
        });
    }

    initTiles() {
        let tiles = [];
        for (let i = 0; i < nbOfTiles; i++) {
            tiles.push(i);
        }
        for (var i = 0; i < shuffleCount; i++) {
            const direction = getRandomInt(0, 4);
            const emptyTilePosition = tiles[nbOfTiles - 1];
            if (canMove(emptyTilePosition, direction)) {
                tiles = swap(tiles, emptyTilePosition, getTileToMove(emptyTilePosition, direction));
            }
        }
        return tiles;
    }

    tryToMove(direction) {
        const emptyTilePosition = this.state.tiles[nbOfTiles - 1];

        if (this.hasWon() || !canMove(emptyTilePosition, direction)) {
            this.setState({
                startingX: null,
                startingY: null
            });
        } else {
            this.setState({
                isTutorialVisible: false,
                startingX: null,
                startingY: null,
                tiles: swap(this.state.tiles, emptyTilePosition, getTileToMove(emptyTilePosition, direction))
            });
        }
    }

    hasWon() {
        for (let i = 0; i < this.state.tiles.length; i++) {
            if (i !== this.state.tiles[i]) {
                return false;
            }
        }
        return true;
    }

    render() {
        const shouldDisplayWinningScreen = this.hasWon();
        return (
            <div
                className="Scene"
                style={{ maxWidth: this.state.sceneMaxSize }}
                onTouchStart={this.handleTileTouchStart}
                onTouchEnd={this.handleTileTouchEnd}
            >
                <div className="Scene-content">{this.renderTiles()}</div>
                <div
                    className="Winning-screen"
                    style={{
                        transition: shouldDisplayWinningScreen ? '' : 'none',
                        opacity: shouldDisplayWinningScreen ? 1 : 0
                    }}
                >
                    {shouldDisplayWinningScreen && [
                        <img
                            key="full-image"
                            alt="solution"
                            className="Full-image"
                            src={images[this.state.imageIndex].src}
                        />,
                        <a key="author" className="Origin-link" href={images[this.state.imageIndex].origin}>
                            By {images[this.state.imageIndex].author}
                        </a>,
                        <button key="new-game" className="New-game-button" onClick={this.handleNewGameClick}>
                            New Game
                        </button>
                    ]}
                </div>
                <div className="Tutorial-screen" style={{ opacity: this.state.isTutorialVisible ? 1 : 0 }}>
                    <span>Swipe or use keyboard arrows.</span>
                </div>
                <div className="About">
                    <a href="https://github.com/GuillaumeSalles/8-squares">About</a>
                </div>
            </div>
        );
    }

    renderTiles() {
        return this.state.tiles.map((tile, i) => {
            return (
                <Tile
                    key={i}
                    position={tile}
                    isVisible={i !== nbOfTiles - 1}
                    originalPosition={i}
                    gridSize={gridSize}
                    source={images[this.state.imageIndex].src}
                    sceneMaxSize={this.state.sceneMaxSize}
                />
            );
        });
    }
}

export default App;
