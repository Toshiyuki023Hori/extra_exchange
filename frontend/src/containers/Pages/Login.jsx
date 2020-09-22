import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import Login_Form from '../Organisms/Login_Form';
import { connect, useSelector } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
import Header from "../Organisms/Header"

function Login({ isAuthenticated,uid,onTryAutoSignup,error }) {
  return (
    <>
      {isAuthenticated ? <h1>You succeeded in Loging in</h1> : <h1>Don't give up!!</h1>}
        <Login_Form />
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
