import React, {useEffect} from "react"
import axios from "axios"

import Form from "../shared/form"

function Register(){

    return(
        <>
            <Form label = "ユーザーネーム" type = "text"/>
            <Form label = "メールアドレス" type = "email"/>
            <Form label = "パスワード" type = "password"/>
            <Form label = "パスワード確認" type = "password"/>
        </>
    )
}

export default Register;