import React, { Component } from 'react';
import { connect } from 'react-redux';
import SearchBox from '../../presentational/shared/SearchBox';
import history from '../../history';
import styled from 'styled-components';
import axios from 'axios';
import Logo from '../../assets/Logo.png';
import SmallButton from '../../presentational/shared/SmallButton';
import * as actions from '../../reducks/auth/actions';

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
    const logout = this.props.logout;
    logout();
    history.push('/login');
  }

  jumpToLogin() {
    history.push('/login');
  }

  jumpToRegister() {
    history.push('/registration');
  }

  jumpToPostGive() {
    history.push('/give/add');
  }

  render() {
    return (
      <>
        <Wrapper>
          <img src={Logo} alt="" width="50px" />
          <SearchBox />
          {this.props.isAuthenticated ? (
            <>
              {/* 　ログイン済ユーザー */}
              <a href="#" onClick={this.handleLogout}>
                ログアウト
              </a>
              <p>こんにちは、{this.state.loginUser.username}さん</p>　
              <div>
                <SmallButton btn_name="ポスト" btn_click={this.jumpToPostGive} />
                <SmallButton btn_name="通知" btn_click="" />
              </div>
            </>
          ) : (
            <>
              {/* ゲストユーザー */}
              <p>こんにちは、ゲストさん</p>
              <div>
                <SmallButton btn_name="ログイン" btn_click={this.jumpToLogin} />
                <SmallButton btn_name="登録" btn_click={this.jumpToRegister} />
              </div>
            </>
          )}
        </Wrapper>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.token !== null,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout),
  };
};

const Wrapper = styled.div`
  background-color: #8dd6ff;
`;

const Image = styled.img``;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
