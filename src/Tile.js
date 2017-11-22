import React, { Component } from 'react';
import './Tile.css';

const tileSpacing = 1;

export default class Tile extends Component {
    getTilePosition() {
        const posX = (this.props.position % this.props.gridSize) * 100;
        const posY = Math.floor(this.props.position / this.props.gridSize) * 100;
        return `translateX(${posX}%) translateY(${posY}%)`;
    }

    getSourceOffset() {
        const offsetX = (this.props.originalPosition % this.props.gridSize) / this.props.gridSize * 100;
        const offsetY = Math.floor(this.props.originalPosition / this.props.gridSize) / this.props.gridSize * 100;
        return `translateX(-${offsetX}%) translateY(-${offsetY}%) translateX(${-tileSpacing}px) translateY(${-tileSpacing}px) `;
    }

    shouldComponentUpdate(nextProps) {
        return (
            this.props.isVisible !== nextProps.isVisible ||
            this.props.position !== nextProps.position ||
            this.props.originalPosition !== nextProps.originalPosition ||
            this.props.gridSize !== nextProps.gridSize ||
            this.props.source !== nextProps.source ||
            this.props.sceneMaxSize !== nextProps.sceneMaxSize
        );
    }

    render() {
        const tileStyles = {
            width: 100 / this.props.gridSize + '%',
            transform: this.getTilePosition(),
            visibility: this.props.isVisible ? 'visible' : 'hidden'
        };

        const tileSourceStyles = {
            maxWidth: this.props.sceneMaxSize,
            transform: this.getSourceOffset()
        };

        return (
            <div className="Tile" tile={this.props.originalPosition} style={tileStyles}>
                <div
                    className="Tile-content"
                    style={{
                        margin: tileSpacing
                    }}
                >
                    <img
                        alt={'tile' + this.props.originalPosition}
                        className="Tile-source"
                        style={tileSourceStyles}
                        src={this.props.source}
                    />
                </div>
            </div>
        );
    }
}
