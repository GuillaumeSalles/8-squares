import React, { Component } from 'react';
import './Tile.css';

export default class Tile extends Component {
    constructor(props) {
        super(props);

        this.tileSpacing = 0.5;
        this.appPadding = 18; //make it dynamic with css
    }

    getNbOfColumns() {
        return Math.sqrt(this.props.total);
    }

    getTileSize() {
        return this.getNbOfColumns() / this.props.total * 100 + '%';
    }

    getTilePosition() {
        const posX = (this.props.position % this.getNbOfColumns()) * 100;
        const posY = Math.floor(this.props.position / this.getNbOfColumns()) * 100;
        return `translateX(${posX}%) translateY(${posY}%)`;
    }

    getSourceOffset() {
        const offsetX = (this.props.originalPosition % this.getNbOfColumns()) / this.getNbOfColumns() * 100;
        const offsetY = Math.floor(this.props.originalPosition / this.getNbOfColumns()) / this.getNbOfColumns() * 100;
        return `translateX(-${offsetX}%) translateY(-${offsetY}%)`;
    }

    shouldComponentUpdate(nextProps) {
        return (
            this.props.isVisible !== nextProps.isVisible ||
            this.props.position !== nextProps.position ||
            this.props.originalPosition !== nextProps.originalPosition ||
            this.props.total !== nextProps.total ||
            this.props.source !== nextProps.source ||
            this.props.sceneMaxSize !== nextProps.sceneMaxSize
        );
    }

    render() {
        const tileStyles = {
            width: this.getTileSize(),
            transform: this.getTilePosition(),
            visibility: this.props.isVisible ? 'visible' : 'hidden'
        };

        const tileContentStyles = {
            margin: this.tileSpacing
        };

        // Source dimension has to be full width
        const amountToRemove = this.tileSpacing * this.getNbOfColumns() + this.appPadding + this.tileSpacing * 2;
        const tileSourceStyles = {
            width: `calc(100vw - ${amountToRemove}px)`,
            maxWidth: this.props.sceneMaxSize - amountToRemove,
            transform: this.getSourceOffset()
        };

        return (
            <div className="Tile" tile={this.props.originalPosition} style={tileStyles}>
                <div className="Tile-content" style={tileContentStyles}>
                    <img className="Tile-source" style={tileSourceStyles} src={this.props.source} />
                </div>
            </div>
        );
    }
}
