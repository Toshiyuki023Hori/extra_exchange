import React, {useState} from "react"

import RegisterForm from "../shared/RegisterForm";

function Register(){
    

    return(
        <>
            <div>
                <RegisterForm initialValue = "" method = "POST" url=""/>
            </div>
        </>
    )
}

export default Register;