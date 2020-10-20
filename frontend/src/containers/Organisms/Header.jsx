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
import { Colors } from '../../presentational/shared/static/CSSvariables';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: this.props.loginUser,
    };
    this.jumpToLogin = this.jumpToLogin.bind(this);
    this.jumpToRegister = this.jumpToRegister.bind(this);
    this.jumpToTop = this.jumpToTop.bind(this);
    this.jumpToPostGive = this.jumpToPostGive.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
  }

  async handleLogout() {
    await this.props.logout();
    history.push('/top');
  }

  jumpToLogin() {
    history.push('/login');
  }

  jumpToRegister() {
    history.push('/registration');
  }

  jumpToTop(){
    history.push("/top")
  }

  jumpToPostGive() {
    history.push('/give/add');
  }

  render() {
    const { isAuthenticated } = this.props;
    const { loginUser } = this.state;
    let authenticatedView;
    let guestView;
    if (isAuthenticated) {
      authenticatedView = (
        <>
          {/* 　ログイン済ユーザー */}
          <div>
            <MessageToUserDiv>
              <div>
                <UsernamePara>
                  こんにちは {loginUser.username}さん
                </UsernamePara>
                <SubMenuUL>
                  <SubMenuLI>
                    <a href="/about">アバウト</a>
                  </SubMenuLI>
                  <SubMenuLI>
                    <a href="/about">ユーザー情報を見る</a>
                  </SubMenuLI>
                  <SubMenuLI>
                    <a href="">リクエスト一覧を見る</a>
                  </SubMenuLI>
                  <SubMenuLI>
                    <a href="">取引一覧を見る</a>
                  </SubMenuLI>
                </SubMenuUL>
              </div>
              <LogoutButton onClick={this.handleLogout}>ログアウト</LogoutButton>
            </MessageToUserDiv>
            <AuthButtonDiv>
              <SmallButton
                btn_name="ポスト"
                btn_border="#466A80"
                btn_back="#466A80"
                btn_text_color="#D9F1FF"
                btn_click={this.jumpToPostGive}
              />
              <SmallButton
                btn_name="通知"
                btn_border="#466A80"
                btn_back="#8DD6FF"
                btn_text_color="#466A80"
                btn_click=""
              />
            </AuthButtonDiv>
          </div>
        </>
      );
    } else {
      guestView = (
        <>
          {/* ゲストユーザー */}
          <div>
            <MessageToUserDiv>
              <UsernamePara>こんにちは ゲストさん</UsernamePara>
              <SubMenuUL>
                <SubMenuLI>
                  <a href="/about">アバウト</a>
                </SubMenuLI>
              </SubMenuUL>
            </MessageToUserDiv>
            <AuthButtonDiv>
              <SmallButton
                btn_name="登録"
                btn_click={this.jumpToRegister}
                btn_border="#466A80"
                btn_back="#466A80"
                btn_text_color="#D9F1FF"
              />
              <SmallButton
                btn_name="ログイン"
                btn_border="#466A80"
                btn_back="#8DD6FF"
                btn_text_color="#466A80"
                btn_click={this.jumpToLogin}
              />
            </AuthButtonDiv>
          </div>
        </>
      );
    }
    return (
      <>
        <Wrapper>
          {/* CSS Grid( 1 : 1 : 1) 左 */}
          <Image src={Logo} alt="" onClick={this.jumpToTop}/>
          {/* CSS Grid( 1 : 1 : 1) 中央 */}
          <SearchBox />
          {/* CSS Grid( 1 : 1 : 1) 右 */}
          {authenticatedView}
          {guestView}
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
    logout: () => dispatch(actions.logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const Wrapper = styled.div`
  z-index:30;
  position:fixed;
  top:0;
  left:0;
  background-color: #8dd6ff;
  width: 100%;
  height:110px;
  display: grid;
  grid-template-columns: 1fr 2.3fr 1fr;
  padding: 10px 5px 5px 5px;
  box-shadow: 0px 1px 5px;
`;

const Image = styled.img`
  width: 230px;
  margin-top: 5px;

  &:hover{
    box-shadow:0px 0px 7px ${Colors.accent2};
    transform:scale(1.02,1.02);
    transition-duration:0.75s;
  }
`;

const MessageToUserDiv = styled.div`
  font-size: 13px;
  text-align: right;
  height: 20%;
`;

const UsernamePara = styled.p`
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  position:relative;

  &::after{
    content:"▼"
  }

  &:hover ~ ul{
      top: 30px;
      visibility: visible;
      opacity: 1;
    }
`;

const SubMenuUL = styled.ul`
  position: absolute;
  top: 20px;
  width: 100%;
  background: ${Colors.subcolor1};
  transition: all .2s ease;
  visibility: hidden;
  opacity: 0;
  z-index:41;
  list-style:none; 
  text-align:left;

  &:hover{
    top:30px;
    visibility:visible;
    opacity:1;
  }
`;

const SubMenuLI = styled.li`
  a{
    display:block;
  }
`;

const LogoutButton = styled.button`
  color: #6e787f;
  width: 30%;
  outline:none;

  &:hover{
    font-weight:bold;
  }
`;

const AuthButtonDiv = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 80%;
`;
