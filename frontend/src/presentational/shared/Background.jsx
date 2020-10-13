import React, { Component } from 'react';
import styled from 'styled-components';
import defBackGround from '../../assets/default_bg.jpg';
import { Colors } from './static/CSSvariables';

class Background extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <BackImage
        {...this.props}
        bg_width={this.props.bg_width}
        bg_height={this.props.bg_height}
        background={this.props.background === null ? defBackGround : this.props.background}
        alt=""
      />
    );
  }
}

export default Background;

const BackImage = styled.div`
  width: ${(props) => props.bg_width};
  height: ${(props) => props.bg_height};
  background:url(${(props) => props.background}) center;
  background-size: cover;
`;