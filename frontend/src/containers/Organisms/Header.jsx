import React, { Component } from 'react';
import SearchBox from '../../presentational/shared/SearchBox';
import axios from 'axios';
import Logo from '../../assets/Logo.png';
import SmallButton from '../../presentational/shared/SmallButton';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: this.props.loginUser,
    };
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
          <p>こんにちは、ゲストさん</p>
        )}
      </>
    );
  }
}

export default Header;
