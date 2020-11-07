import * as actionTypes from './actionType';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { store } from '../../index';
import history from '../../history';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token, uid) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    uid: uid,
  };
};

export const setUid = (uid) => {
  return {
    type: actionTypes.SET_UID,
    uid: uid,
  };
};

export const authFail = (error) => {
  return {
    type: actionTypes.AUTH_FAIL,
    error: error,
  };
};

export const authLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  localStorage.removeItem('uid');
  return {
    type: actionTypes.AUTH_LOGOUT,
  };
};

export const logout = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    axios
      .post('http://localhost:8000/rest-auth/logout/', authHeader)
      .then((res) => {
        dispatch(authLogout());
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

// ========================    ========================    ========================    ========================

// 以下redux-thunx用のasync action creator　=========      ============       =============-    ===========

export const checkAuthTimeout = (expirationTime) => {
  return (dispatch) => {
    setTimeout(() => {
      dispatch(logout());
    }, expirationTime * 1000);
  };
};

export const getUserId = (username, loginOrRegister) => {
  return (dispatch) => {
    axios
      .get('http://localhost:8000/api/user')
      .then(async (res) => {
        const users = res.data;
        const currentUser = users.filter((user) => user.username === username)[0];
        const uid = currentUser.id;
        const isGuest = username.includes('guest');
        localStorage.setItem('uid', uid);
        dispatch(authSuccess(localStorage.getItem('token'), uid));
        if (loginOrRegister === 'register' || isGuest){
          history.push('/about');
        }
        else if(loginOrRegister === 'login'){
          history.push('/user/' + uid);
        }
      })
      .catch((err) => {
        localStorage.removeItem('uid');
      });
  };
};

export const authLogin = (username, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post('http://localhost:8000/rest-auth/login/', {
        username: username,
        password: password,
      })
      .then((res) => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        dispatch(checkAuthTimeout(3600));
        dispatch(getUserId(username, 'login'));
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(authFail(err.response.data));
      });
  };
};

export const authSignup = (username, email, password) => {
  return (dispatch) => {
    dispatch(authStart());
    axios
      .post('http://localhost:8000/rest-auth/registration/', {
        username: username,
        email: email,
        password: password,
      })
      .then((res) => {
        const token = res.data.key;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationDate', expirationDate);
        // getUserId内でauthSuccessが実行され、auth_SUCCESSへuid, tokenがセット
        dispatch(checkAuthTimeout(3600));
        dispatch(getUserId(username, 'register'));
      })
      .catch((err) => {
        console.log(err.response);
        dispatch(authFail(err.response.data));
      });
  };
};

export const authCheckState = () => {
  return (dispatch) => {
    const token = localStorage.getItem('token');
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        const uid = localStorage.getItem('uid');
        if (uid) {
          dispatch(authSuccess(token, uid));
        }
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};
