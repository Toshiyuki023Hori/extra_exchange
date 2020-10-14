import React, { Component } from 'react';
import axios from 'axios';
import styled from "styled-components";
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import User_Edit_Form from '../Organisms/User_Edit_Form';
import Header from '../Organisms/Header';
import User_Sidemenu from "../Organisms/User_Sidemenu";

import { mixinHeaderSpace } from "../../presentational/shared/static/CSSvariables";


class UserEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
    };
  }
  componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    // 非認証ユーザーのリダイレクト
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          {/* localstrageのuidを利用 = 他Userの閲覧ありえない = 常時true */}
          <Body>
            <User_Sidemenu user_id={this.state.loginUser.id} isUser='true'/>
            <EditFormDiv>
              <User_Edit_Form
                loginUser={this.state.loginUser}
                axiosUrl="http://localhost:8000/api/"
              />
            </EditFormDiv>
          </Body>
        </>
      );
    }
  }
}

export default UserEdit;

const Body = styled.div`
  ${mixinHeaderSpace};
  display:flex;
`;

const EditFormDiv = styled.div`
  flex:1;
  padding: 20px 0px 0px 20px;
`;