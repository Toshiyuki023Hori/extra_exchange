import React, { useState } from 'react';

import LoginForm from '../Organisms/LoginForm';
import { connect } from 'react-redux';

function Login({isAuthenticated}) {
  return (
    <>
      {isAuthenticated ? <h1>You succeeded in Loging in</h1> : <h1>Don't give up!!</h1>}
      <div>
        <LoginForm initialValue="" method="post" />
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

export default connect(mapStateToProps)(Login);
