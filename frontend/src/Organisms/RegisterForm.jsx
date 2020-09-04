import React,{useState} from "react"
import PropTypes from "prop-types"
import axios from "axios"
import MiddleButton from "../shared/MiddleButton"

function RegisterForm(props){
    const [username, setUsername] = useState(props.initialValue);
    const [email, setEmail] = useState(props.initialValue);
    const [password, setPassword] = useState(props.initialValue);
    const [confirmPass, setConfirmPass] = useState(props.initialValue);

    const handleUserName = (e) => {
        setUsername(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPass = (e) => {
        setConfirmPass(e.target.value);
    }

    const handleSubmit = () => {
        axios({
            method : props.method,
            url : props.url,
            data : {
                username,
                email,
                password,
                confirm_pass : confirmPass
            }
        })
        .then((res) => {
            console.log(res.data)
        })
        .catch((error) => {
            console.log(error)
        });

        // インプットを空白に戻すためのコード
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPass("");
    }

    return(
        <>
            <label>ユーザーネーム</label>
            <input name="username" type="text" value={username} onChange={handleUserName}/>

            <label>メール</label>
            <input name="email" type="email" value={email} onChange={handleEmail}/>
            
            <label>パスワード</label>
            <input name="password" type="password" value={password} onChange={handlePassword}/>

            <label>パスワード確認</label>
            <input name="confirmPass" type="password" value={confirmPass} onChange={handleConfirmPass}/>

            <MiddleButton btn_name="登録" btn_type="submit" btn_func={handleSubmit}/>
        </>
    )
}

RegisterForm.propTypes = {
    url : PropTypes.string,
    method : PropTypes.string
};

export default RegisterForm;