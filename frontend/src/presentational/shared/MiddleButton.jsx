import React from 'react';
import styled from "styled-components";

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
    >
      {props.btn_name}
    </StyledButton>
  );
}

export default MiddleButton;

const StyledButton = styled.button`
  font-size:1.18em;
  height:45px;
  width:250px;
  padding:2px 3.5px;
  border:solid 2.5px;
  border-radius:10px;
  background: ${(props) => props.btn_back};
  color:${(props) => props.btn_text_color};
`;