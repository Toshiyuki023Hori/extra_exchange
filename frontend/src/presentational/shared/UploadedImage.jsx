import React, { Component } from 'react';

export default class Image extends Component {
  render() {
    return (
      <React.Fragment>
        <img
          src={this.props.imgFile}
          alt={this.props.imgName}
          className={this.props.imageClass}
        ></img>
      </React.Fragment>
    );
  }
}
