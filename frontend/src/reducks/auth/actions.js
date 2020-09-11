import * as actionTypes from './actionType';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { store } from '../store/store';

export const authStart = () => {
  return {
    type: actionTypes.AUTH_START,
  };
};

export const authSuccess = (token,uid) => {
  return {
    type: actionTypes.AUTH_SUCCESS,
    token: token,
    uid:uid
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

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('expirationDate');
  axios
    .post('http://localhost:8000/rest-auth/logout/')
    .then((res) => {
      console.log(res.json());
    })
    .catch((err) => {
      console.log(err);
    });
  return {
    type: actionTypes.AUTH_LOGOUT,
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

export const getUserId = (username) => {
  return (dispatch) => {
    axios.get('http://localhost:8000/api/user').then((res) => {
      const users = res.data;
      const currentUser = users.filter((user) => user.username === username)[0];
      const uid = currentUser.id;
      dispatch(authSuccess(localStorage.getItem('token'), uid));
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
        dispatch(getUserId(username));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        dispatch(authFail(err));
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
        dispatch(getUserId(username));
        dispatch(checkAuthTimeout(3600));
      })
      .catch((err) => {
        dispatch(authFail(err));
      });
  };
};

export const authCheckState = () => {
  return async(dispatch) => {
    const token = localStorage.getItem('token');
    if (token === undefined) {
      dispatch(logout());
    } else {
      const expirationDate = new Date(localStorage.getItem('expirationDate'));
      if (expirationDate <= new Date()) {
        dispatch(logout());
      } else {
        //
        //uidを取得してからauthSuccessを実行させたいです。
        const uid = await store.getState().uid;
        dispatch(authSuccess(token, uid));
        console.log("uid is " + uid + " and token is " + token)
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
      }
    }
  };
};

