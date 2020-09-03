import React, {useState} from "react"

import RegisterForm from "../Organisms/RegisterForm";

function Register(){
    

    return(
        <>
            <div>
                <RegisterForm initialValue = "" method = "post" url="http://localhost:8000/api/user/"/>
            </div>
        </>
    )
}

export default Register;