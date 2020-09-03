import React from "react"
import PropTypes from "prop-types"

function Form(props){
    
    return(
        <>
            <label>{props.label}</label>
            <input type={props.type} value={props.value} />
        </>
    )
}

Form.propTypes = {
    label : PropTypes.string,
    type : PropTypes.string
};

export default Form;