import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors } from './static/CSSvariables';
import avater from '../../assets/Icon.png';

class Icon extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let imageSrc;
    return (
      <Image
        {...this.props}
        src={this.props.icon === null ? avater : this.props.icon}
        alt="アイテムのオーナーのアイコン"
      />
    );
  }
}

export default Icon;

const Image = styled.img`
  width: ${(props) => props.img_width};
  height: ${(props) => props.img_height};
  border-radius: ${(props) => props.img_radius};
  border: 1px solid;
  border-color: ${Colors.accent2};
  object-fit: contain;
`;
