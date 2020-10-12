import React from 'react';
import styled from "styled-components";
import { lighten, darken } from 'polished';

import PropTypes from 'prop-types';

function LargeButton(props) {
  return (
    <StyledButton
      {...props}
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

export default LargeButton;

const StyledButton = styled.button`
  font-size:1.18em;
  height:45px;
  width:370px;
  padding:2px 3.5px;
  border-radius:10px;
  background: ${(props) => props.btn_disable ? lighten(0.4, '#466A80' ): props.btn_back};
  color:${(props) => props.btn_text_color};
  box-shadow: 4px 3px 0px ${(props) => props.btn_shadow};
  outline:none;

`;