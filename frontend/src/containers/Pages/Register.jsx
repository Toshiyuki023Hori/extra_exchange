import React from 'react';
import { withRouter } from 'react-router-dom';
import Register_Form from '../Organisms/Register_Form';
import { connect, useSelector } from 'react-redux';
import Header_LogReg from "../Organisms/Header_LogReg";

function Register(props) {
  return (
    <>
      <div>
        <Header_LogReg loginOrRegister="会員登録"/>
        <Register_Form />
      </div>
    </>
  );
}

export default Register;
