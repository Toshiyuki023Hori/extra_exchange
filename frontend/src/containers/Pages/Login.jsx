import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import styled from "styled-components";
import Login_Form from '../Organisms/Login_Form';
import { connect } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
import Header_LogReg from "../Organisms/Header_LogReg";
import Footer from "../Organisms/Footer";

function Login() {
  return (
    <>
      <div>
          <StyledHeader loginOrRegister="ログイン"/>
          <Login_Form/>
          <Footer/>
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    uid: state.uid,
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onTryAutoSignup: () => dispatch(actions.authCheckState()),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login));

const StyledHeader = styled(Header_LogReg)`
  position:fixed;
  top:0;
  left:0;
`;