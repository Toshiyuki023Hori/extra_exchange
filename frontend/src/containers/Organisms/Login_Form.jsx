import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MiddleButton from '../../presentational/shared/MiddleButton';
import { connect } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
import history from '../../history';

class Login_Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   #インプット情報用
      info: {
        username: '',
        password: '',
      },
      //   Validation用
      message: {
        username: '',
        password: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           state変更に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    const { info, message } = this.state;
    this.setState({
      info: { ...info, [name]: value },
    });
    this.setState({
      message: { ...message, [name]: this.validator(name, value) },
    });
  }

  //           ===========           ===========
  //           Validation            ===========
  //           ===========           ===========

  validator(name, value) {
    switch (name) {
      case 'username':
        return this.usernameValidation(value);
      case 'password':
        return this.passwordValidation(value);
    }
  }

  usernameValidation(value) {
    if (!value) return 'ユーザーネームは必須項目です。';
    if (value.length < 5) return 'ユーザーネームは最低5文字以上入力してください。';
    return '';
  }

  passwordValidation(value) {
    if (!value) return 'パスワードは必須項目です。';
    if (value.length < 8) return 'パスワードは最低8文字入力してください。';
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i;
    if (!regex.test(value))
      return 'パスワードは半角英数字をそれぞれ一種類以上含める必要があります。';
    return '';
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleSubmit = async () => {
    this.props.onAuth(this.state.info.username, this.state.info.password);
  };

  handleLogout = () => {
    this.props.logout();
  };

  render() {
    let errorMessage = null;
    if (this.props.error) {
      errorMessage = <p>ユーザーネームか、パスワードが間違っています</p>;
    }

    const { info, message } = this.state;
    return (
      <>
        <div>
          {errorMessage}

          <div>
            <label>ユーザーネーム</label>
            <input name="username" type="text" value={info.username} onChange={this.handleChange} />
            <p>{message.username}</p>
          </div>

          <div>
            <label>パスワード</label>
            <input
              name="password"
              type="password"
              value={info.password}
              onChange={this.handleChange}
            />
            <p>{message.password}</p>
          </div>

          <MiddleButton
            btn_name="ログイン"
            btn_click={this.handleSubmit}
            btn_disable={!info.username || !info.password || message.username || message.password}
          />

          <MiddleButton btn_name="サインアウト" btn_click={this.handleLogout} />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, password) => dispatch(actions.authLogin(username, password)),
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login_Form);
