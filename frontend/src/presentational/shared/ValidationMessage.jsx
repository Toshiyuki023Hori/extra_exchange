import React, { Component } from 'react';
import styled from 'styled-components';
import { Colors } from './static/CSSvariables';

class ValidationMessage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ErrorMessage 
      isShowup={this.props.isShowup} 
      text_color={this.props.text_color}
      margin={this.props.margin}
      bg_color={this.props.bg_color}
      >
        {this.props.errorMessage}
      </ErrorMessage>
    );
  }
}

export default ValidationMessage;

const ErrorMessage = styled.p`
  display: flex;
  align-items:center;
  justify-content:center;
  height: 32px;
  width:50%;
  font-size: 0.7rem;
  margin: ${(props) => props.margin};
  text-align: center;
  line-height: 32px;
  background: ${(props) => (props.isShowup ? props.bg_color : 'none')};
  border-radius: 20px;
  color: ${(props) => props.text_color};
  font-weight:700;
`;
