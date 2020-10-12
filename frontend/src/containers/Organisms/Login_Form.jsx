import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import MiddleButton from '../../presentational/shared/MiddleButton';
import { connect } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
import history from '../../history';
import { Wrapper,Tytle,InputArea,FormArea,FormLabel,InputForm,Error,SubmitButton } from "./Register_Form";
import { Colors } from "../../presentational/shared/static/CSSvariables";

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
    let errorMessage = "";
    if (this.props.error) {
      errorMessage = "ユーザーネームか、パスワードが間違っています";
    }

    const { info, message } = this.state;
    return (
      <>
        <Wrapper>
          <Tytle>ログイン</Tytle>
          <InputArea>
            <FormArea>
              <li>
                <FormLabel>ユーザーネーム</FormLabel>
                <InputForm name="username" type="text" value={info.username} onChange={this.handleChange} placeholder="最低5文字以上入力してください"/>
              </li>
              <Error alert={message.username}>{message.username}</Error>

              <li>
                <FormLabel>パスワード</FormLabel>
                <InputForm
                  name="password"
                  type="password"
                  value={info.password}
                  onChange={this.handleChange}
                  placeholder="半角英数字最低8文字以上入力してください"
                />
              </li>
              {/* 初期値のnullではない */}
              {/* サーバーからのエラーが投げられてる */}
              {/* null時は入力フォームにValidation */}
                {
                  this.props.error != null
                  ? <Error alert={errorMessage}>
                      {errorMessage}
                    </Error>
                  : <Error alert={message.password}>
                      {message.password}
                    </Error>
                }
            </FormArea>
            <SubmitButton
              btn_name="ログイン"
              btn_click={this.handleSubmit}
              btn_disable={!info.username || !info.password || message.username || message.password}
              btn_back={Colors.accent2}
              btn_text_color={Colors.subcolor1}
              btn_shadow={Colors.accent1}
            />
          </InputArea>

        </Wrapper>
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
