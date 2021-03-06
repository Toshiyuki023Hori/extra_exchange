import * as actionTypes from './actionType';
import { updateObject } from '../utility';

const initialState = {
  token: null,
  error: null,
  loading: false,
  uid: null,
};

const authStart = (state, action) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const authSuccess = (state, action) => {
  // updateObjectによりstateの更新をfunction化
  return updateObject(state, {
    token: action.token,
    error: null,
    loading: false,
    uid : action.uid
  });
};

const authFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const authLogout = (state, action) => {
  return updateObject(state, {
    token: null,
    uid: null,
  });
};

const setUid = (state, action) => {
  return updateObject(state, {
    uid: action.uid,
  });
};

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return authStart(state, action);
    case actionTypes.AUTH_SUCCESS:
      return authSuccess(state, action);
    case actionTypes.AUTH_FAIL:
      return authFail(state, action);
    case actionTypes.AUTH_LOGOUT:
      return authLogout(state, action);
    default:
      return state;
  }
};

export default reducer;
