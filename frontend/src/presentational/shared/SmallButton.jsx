import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';

class SmallButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <StyledButton
        {...this.props}
        className={this.props.className}
        type={this.props.btn_type}
        onClick={this.props.btn_click}
        onSubmit={this.props.btn_submit}
        disabled={this.props.btn_disable}
      >
        {this.props.btn_name}
      </StyledButton>
    );
  }
}

export default SmallButton;

const StyledButton = styled.button`
  font-size: 1.18em;
  border-radius: 7px;
  height: 45px;
  width: 100px;
  padding: 2px 3.5px;
  border: solid 2.5px;
  border-color: ${(props) => props.btn_border};
  background: ${(props) => props.btn_back};
  color: ${(props) => props.btn_text_color};

  &:hover {
    opacity: 0.7;
  }
`;
