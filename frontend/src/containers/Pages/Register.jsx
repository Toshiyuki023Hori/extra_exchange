import React, { useState } from 'react';

import RegisterForm from '../Organisms/RegisterForm';
import { connect } from 'react-redux';

function Register(props) {
  return (
    <>
      {props.isAuthenticated ? <h1>You succeeded in Loging in</h1> : <h1>Don't give up!!</h1>}
      <div>
        <RegisterForm />
      </div>
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
  };
};

export default connect(mapStateToProps)(Register);
