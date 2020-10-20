import React from 'react';
import styled from 'styled-components';
import { lighten } from 'polished';
import PropTypes from 'prop-types';

function MiddleButton(props) {
  return (
    <StyledButton
      type={props.btn_type}
      onClick={props.btn_click}
      onSubmit={props.btn_submit}
      disabled={props.btn_disable}
      btn_back={props.btn_back}
      btn_text_color={props.btn_text_color}
      btn_shadow={props.btn_shadow}
    >
      {props.btn_name}
    </StyledButton>
  );
}

export default MiddleButton;

const StyledButton = styled.button`
  height: 45px;
  width: 250px;
  font-size: 1.18em;
  font-weight: 550;
  padding: 2px 3.5px;
  border-radius: 10px;
  background: ${(props) => props.btn_disable ? lighten(0.4, props.btn_back) : props.btn_back};
  color: ${(props) => props.btn_text_color};
  box-shadow: 4px 3px ${(props) => props.btn_shadow};
  outline: none;

  &:hover{
    background:${(props) => lighten(0.7, props.btn_back)};
  }
`;
