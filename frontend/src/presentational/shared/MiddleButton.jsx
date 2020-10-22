import React from 'react';
import styled from 'styled-components';
import { Colors } from './static/CSSvariables';
import PropTypes from 'prop-types';

function MiddleButton(props) {
  return (
    <StyledButton
      className={props.className}
      type={props.btn_type}
      onClick={props.btn_click}
      onSubmit={props.btn_submit}
      disabled={props.btn_disable}
    >
      {props.children}
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
  outline: none;
`;
