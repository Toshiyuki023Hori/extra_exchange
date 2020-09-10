import React, {useEffect} from 'react';

import LoginForm from '../Organisms/LoginForm';
import { connect, useSelector } from 'react-redux';

function Login({isAuthenticated}) {
    const token = useSelector(state => state.token)
    useEffect(() => {
        console.log(token)
    },[isAuthenticated])
    
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
