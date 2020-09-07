import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import MiddleButton from "../shared/MiddleButton";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        username: "",
        email: "",
        password: "",
        confirmPass: "",
      },
      message: {
        username: "",
        email: "",
        password: "",
        confirmPass: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    const { info, message } = this.state;
    this.setState({
      info: { ...info, [name]: value },
    });
    this.setState({
      message: { ...message, [name]: this.validator(name, value) },
    });
  }

  validator(name, value) {
    switch (name) {
      case "username":
        return this.usernameValidation(value);
      case "email":
        return this.emailValidation(value);
      case "password":
        return this.passwordValidation(value);
      case "confirmPass":
        return this.confirmPassValidation(value);
    }
  }

  usernameValidation(value) {
    if (!value) return "ユーザーネームは必須項目です。";
    if (value.length < 5)
      return "ユーザーネームは最低5文字以上入力してください。";
    return "";
  }

  emailValidation(value) {
    if (!value) return "メールアドレスは必須項目です。";
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(value)) return "正しい形式で入力をしてください。";
    return "";
  }

  passwordValidation(value) {
    if (!value) return "パスワードは必須項目です。";
    if (value.length < 8) return "パスワードは最低8文字入力してください。";
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i;
    if (!regex.test(value))
      return "パスワードは半角英数字をそれぞれ一種類以上含める必要があります。";
    return "";
  }
    
  confirmPassValidation(value) {
    if (!value) return "確認用パスワードは必須項目です。";
    if (this.state.info.password !== value)
      return "パスワードが一致しません";
    return "";
  }

  handleSubmit = () => {
    axios({
      method: this.props.method,
      url: this.props.url,
      data: {
        username: this.state.username,
        email: this.state.email,
        password1: this.state.password,
        password2: this.state.password
      },
    })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });

    // インプットを空白に戻すためのコード
    this.setState({
      username: "",
      email: "",
      password: "",
      confirmPass: "",
    });
  };

  render() {
    const { info, message } = this.state;
    return (
      <>
        <label>ユーザーネーム</label>
        <input
          name="username"
          type="text"
          value={this.state.info.username}
          onChange={this.handleChange}
        />
        <p>{this.state.message.username}</p>

        <label>メール</label>
        <input
          name="email"
          type="email"
          value={this.state.info.email}
          onChange={this.handleChange}
        />
        <p>{this.state.message.email}</p>

        <label>パスワード</label>
        <input
          name="password"
          type="password"
          value={this.state.info.password}
          onChange={this.handleChange}
        />
        <p>{this.state.message.password}</p>

        <label>パスワード確認</label>
        <input
          name="confirmPass"
          type="password"
          value={this.state.info.confirmPass}
          onChange={this.handleChange}
        />
        <p>{this.state.message.confirmPass}</p>

        <MiddleButton
          btn_name="登録"
          btn_type="submit"
          btn_func={this.handleSubmit}
        />
      </>
    );
  }
}

RegisterForm.propTypes = {
  url: PropTypes.string,
  method: PropTypes.string,
};

export default RegisterForm;
