import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import styled from 'styled-components';
import axios from 'axios';
// 以下各ディレクトリからimport
import * as actions from '../../reducks/auth/actions';
import SearchBox from '../../presentational/shared/SearchBox';
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
          {/* CSS Grid( 1 : 1 : 1) 左 */}
          <Image src={Logo} alt="" />
          {/* CSS Grid( 1 : 1 : 1) 中央 */}
          <SearchBox />
          {/* CSS Grid( 1 : 1 : 1) 右 */}
          {this.props.isAuthenticated ? (
            <>
              {/* 　ログイン済ユーザー */}
              <div>
                <MessageToUserDiv>
                  <span>こんにちは {this.state.loginUser.username}さん</span>　
                  <LogoutButton onClick={this.handleLogout}>ログアウト</LogoutButton>
                </MessageToUserDiv>
                <AuthButtonDiv>
                  <SmallButton
                    btn_border="#466A80"
                    btn_back="#466A80"
                    btn_text_color="#D9F1FF"
                    btn_name="ポスト"
                    btn_click={this.jumpToPostGive}
                  />
                  <SmallButton
                    btn_border="#466A80"
                    btn_back="#8DD6FF"
                    btn_text_color="#466A80"
                    btn_name="通知"
                    btn_click=""
                  />
                </AuthButtonDiv>
              </div>
            </>
          ) : (
            <>
              {/* ゲストユーザー */}
              <div>
                <p>こんにちは ゲストさん</p>
                <AuthButtonDiv>
                  <SmallButton btn_name="登録" btn_click={this.jumpToRegister} />
                  <SmallButton btn_name="ログイン" btn_click={this.jumpToLogin} />
                </AuthButtonDiv>
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
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2.3fr 1fr;
  padding: 10px 5px 5px 5px;
`;

const Image = styled.img`
  width: 230px;
  margin-top: 5px;
`;

const MessageToUserDiv = styled.div`
  font-size: 13px;
  text-align: right;
  height: 20%;
`;

const LogoutButton = styled.button`
  color: #6e787f;
  width: 30%;
`;

const AuthButtonDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 80%;
`;

export default connect(mapStateToProps, mapDispatchToProps)(Header);
