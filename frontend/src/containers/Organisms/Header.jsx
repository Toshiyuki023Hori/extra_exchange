import React, { Component } from 'react';
import SearchBox from '../../presentational/shared/SearchBox';
import history from '../../history';
import axios from 'axios';
import Logo from '../../assets/Logo.png';
import SmallButton from '../../presentational/shared/SmallButton';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: this.props.loginUser,
    };
    this.jumpToLogin = this.jumpToLogin.bind(this);
    this.jumpToPostGive = this.jumpToPostGive.bind(this);
    this.jumpToRegister = this.jumpToRegister.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    history.push('/login');
  }

  jumpToLogin() {
    history.push('/login');
  }

  jumpToRegister() {
    console.log(this.props);
    // history.push("/registration")
  }

  jumpToPostGive() {
    history.push('/give/add');
  }

  render() {
    return (
      <>
        <img src={Logo} alt="" width="50px" />
        <SearchBox />
        {this.props.isAuthenticated ? (
          <>
            <a href="#" onClick={this.handleLogout}>
              ログアウト
            </a>
            <p>こんにちは、{this.state.loginUser.name}さん</p>　
            <SmallButton btn_name="ポスト" btn_click={this.jumpToPostGive} />
            <SmallButton btn_name="通知" btn_click="" />
          </>
        ) : (
          <>
            <p>こんにちは、ゲストさん</p>
            <SmallButton btn_name="ログイン" btn_click={this.jumpToLogin} />
            <SmallButton btn_name="登録" btn_click={this.jumpToRegister} />
          </>
        )}
      </>
    );
  }
}

export default Header;
