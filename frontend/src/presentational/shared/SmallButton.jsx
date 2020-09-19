import React from 'react';
import PropTypes from 'prop-types';

function SmallButton(props) {
  return (
    <button
      type={props.btn_type}
      onClick={props.btn_click}
      onSubmit={props.btn_submit}
      disabled={props.btn_disable}
    >
      {props.btn_name}
    </button>
  );
}

export default SmallButton;
