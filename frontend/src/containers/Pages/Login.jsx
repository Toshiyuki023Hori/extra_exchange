import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Login_Form from '../Organisms/Login_Form';
import { connect } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
import Header_LogReg from "../Organisms/Header_LogReg";

function Login() {
  return (
    <>
      <div>
          <Header_LogReg loginOrRegister="ログイン"/>
          <Login_Form/>
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
