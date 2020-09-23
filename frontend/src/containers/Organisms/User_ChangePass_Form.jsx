import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import SmallButton from '../../presentational/shared/SmallButton';

class User_ChangePass_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
      message: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
      flashMessage: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ info: { ...this.state.info, [name]: value } });
    this.setState({
      message: { ...this.state.message, [name]: this.validator(name, value) },
    });
  };

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Validation           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  validator(name, value) {
    switch (name) {
      case 'oldPassword':
        return this.oldPasswordValidation(value);
      case 'newPassword1':
        return this.newPasswordValidation(value);
      case 'newPassword2':
        return this.confirmPassValidation(value);
    }
  }

  oldPasswordValidation(value) {
    if (!value) return '旧パスワードは必須項目です。';
    if (value.length < 8) return 'パスワードは最低8文字入力してください。';
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i;
    if (!regex.test(value)) return 'パスワードは半角英数字をそれぞれ一種類以上含めたものです';
    return '';
  }

  newPasswordValidation(value) {
    if (!value) return '新パスワードは必須項目です。';
    if (value.length < 8) return 'パスワードは最低8文字入力してください。';
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i;
    if (!regex.test(value))
      return 'パスワードは半角英数字をそれぞれ一種類以上含める必要があります。';
    return '';
  }

  confirmPassValidation(value) {
    if (!value) return '確認用パスワードは必須項目です。';
    if (this.state.info.newPassword1 !== value) return 'パスワードが一致しません';
    return '';
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  async handleSubmit() {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    console.log(authHeader);

    axios
      .post(
        this.props.authUrl,
        {
          oldPassword: this.state.info.oldPassword,
          newPassword1: this.state.info.newPassword1,
          newPassword2: this.state.info.newPassword2,
        },
        authHeader
      )
      .then((res) => {
        if (res.status == '200') {
          this.setState({ flashMessage: 'パスワードの変更に成功しました。' });
        }
      })
      .catch((err) =>
        this.setState({
          flashMessage: '変更に失敗しました。申し訳ありませんが、もう一度入力をお願いします。',
        })
      );

    this.setState({
      info: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
    });
  }

  render() {
    return (
      <div>
        <p>{this.state.flashMessage}</p>
        <div>
          <label>旧パスワード</label>
          <input
            onChange={this.handleChange}
            type="password"
            name="oldPassword"
            value={this.state.oldPassword}
          />
          {this.state.message.oldPassword}
        </div>
        <div>
          <label>新パスワード</label>
          <input
            onChange={this.handleChange}
            type="password"
            name="newPassword1"
            value={this.state.newPassword1}
          />
          {this.state.message.newPassword1}
        </div>
        <div>
          <label>新パスワード(確認用)</label>
          <input
            onChange={this.handleChange}
            type="password"
            name="newPassword2"
            value={this.state.newPassword2}
          />
          {this.state.message.newPassword2}
        </div>
        <SmallButton
          btn_name="変更"
          btn_type="submit"
          btn_click={this.handleSubmit}
          btn_disable={
            !this.state.info.oldPassword ||
            !this.state.info.newPassword1 ||
            !this.state.info.newPassword2 ||
            this.state.message.oldPassword ||
            this.state.message.newPassword1 ||
            this.state.message.newPassword2
          }
        />
      </div>
    );
  }
}

export default User_ChangePass_Form;
