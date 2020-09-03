import React from "react"
import PropTypes from "prop-types"

function MiddleButton(props){

    return(
        <button type = {props.button_type} onClick = {props.btn_func}>{props.btn_name}</button>
    )
}

export default MiddleButton;