import React from 'react';
import { withRouter } from 'react-router-dom';
import RegisterForm from '../Organisms/RegisterForm';
import { connect, useSelector } from 'react-redux';

function Register(props) {
  const token = useSelector((state) => state.token);
  return (
    <>
      {console.log(token)}
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

export default withRouter(connect(mapStateToProps)(Register));
