import React, { Component } from 'react';
import './Tile.css';

export default class Tile extends Component {

    getSize() {
        const total = this.props.total;
        const size = this.props.sceneSize;
        return Math.sqrt(total) / total * 100 + '%';
    }

    render() {
        // Dimension of the tile
        const tileStyles = {
            width: this.getSize(),
            paddingBottom: this.getSize(),
            height: 0
        };

        // Source dimension has to be full width
        const sourceSize = {
            width: this.props.sceneSize
        };

        return (
            <div className="Tile" style={tileStyles}>
                <div className="Tile-infos">{this.props.position} of {this.props.total}</div>
                <img
                    style={sourceSize}
                    className="Tile-source"
                    src={this.props.source}/>
            </div>
        );
    }
}