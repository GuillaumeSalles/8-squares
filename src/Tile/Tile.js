import React, { Component } from 'react';
import './Tile.css';

export default class Tile extends Component {

    constructor(props) {
        super(props);

        this.tileSpacing = 6;
        this.appPadding = 24; //make it dynamic with css
    }

    getNbOfColumn() {
        return Math.sqrt(this.props.total);
    }

    getSize() {
        return this.getNbOfColumn() / this.props.total * 100 + '%';
    }

    getPosition() {
        const posX = (this.props.position % this.getNbOfColumn()) * 100;
        const posY = Math.floor(this.props.position / this.getNbOfColumn()) * 100;

        return `translateX(${posX}%) translateY(${posY}%)`;
    }

    render() {
        const tileStyles = {
            width: this.getSize(),
            transform: this.getPosition()
        };

        const tileContentStyles = {
            margin: this.tileSpacing
        };

        // Source dimension has to be full width
        const amountToRemove = this.tileSpacing * this.getNbOfColumn() + this.appPadding;
        const tileSourceSize = {
            width: `calc(100vw - ${amountToRemove}px)`,
            maxWidth: this.props.sceneMaxSize - amountToRemove
        };

        return (
            <div
                className="Tile"
                style={tileStyles}>
                <div
                    className="Tile-content"
                    style={tileContentStyles}>
                    <div className="Tile-infos">{this.props.position} of {this.props.total}</div>
                    <img
                        style={tileSourceSize}
                        className="Tile-source"
                        src={this.props.source}/>
                </div>
            </div>
        );
    }
}