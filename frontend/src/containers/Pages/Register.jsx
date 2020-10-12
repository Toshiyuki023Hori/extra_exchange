import React from 'react';
import { withRouter } from 'react-router-dom';
import Register_Form from '../Organisms/Register_Form';
import { connect, useSelector } from 'react-redux';
import Header_LogReg from "../Organisms/Header_LogReg";
import Footer from "../Organisms/Footer";

function Register(props) {
  return (
    <>
      <div>
        <Header_LogReg loginOrRegister="会員登録"/>
        <Register_Form />
        <Footer/>
      </div>
    </>
  );
}

export default Register;
