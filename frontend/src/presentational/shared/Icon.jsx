import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors } from "./static/CSSvariables";
import avater from "../../assets/Icon.png"

class Icon extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { icon } = this.props;
    let imageSrc;
    if (icon === null) {
        imageSrc = avater;
    } else {
      imageSrc = icon;
    }
    return <Image {...this.props} src={imageSrc} alt="アイテムのオーナーのアイコン" />;
  }
}

export default Icon;

const Image = styled.img`
  width: ${(props) => props.img_width};
  height: ${(props) => props.img_height};
  border-radius : ${(props) => props.img_radius};
  border: 1px solid;
  border-color:${Colors.accent2};
  object-fit:contain;
`;
