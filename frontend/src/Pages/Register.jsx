import React, {useState} from "react"

import RegisterForm from "../Organisms/RegisterForm";
import { connect } from "react-redux"

function Register(props){
    
    let errorMessage = null;
    if (props.error){
        return (
        errorMessage = 
            <p>{props.error.message}</p>
        )
    }
    return(
        <>
            {
                props.isAuthenticated ?
                <h1>You succeeded in Loging in</h1>

                :

                <h1>Don't give up!!</h1>
            }
            <div>
                <RegisterForm initialValue = "" method = "post" url="http://localhost:8000/api/user/"/>
            </div>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        loading : state.loading,
        error: state.error
    }
}

export default connect(mapStateToProps)(Register)