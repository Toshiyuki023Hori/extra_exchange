import React from "react"
import PropTypes from "prop-types"

function Form(props){
    
    return(
        <input type={props.type} value={props.value} />
    )
}

form.propTypes = {
    type = PropTypes.string
};

export default Form;