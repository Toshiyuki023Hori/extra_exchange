import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import User_Header from '../Organisms/User_Header';
import Want_Item_List from '../Organisms/Want_Item_List';
import Give_Item_List_byUser from "../Organisms/Give_Item_List_byUser";

class User_Detail extends Component {
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
    const { loginUser } = this.state;
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={loginUser} />
          <User_Header loginUser={loginUser} />
          <p>{loginUser.profile}</p>
          <Want_Item_List
            owner={this.state.loginUser}
            // 編集・削除ボタンを表示させないため空白
            loginUser=""
            h2Title={'欲しい物リスト'}
            axiosUrl="http://localhost:8000/api/"
          />
          <Give_Item_List_byUser
            owner={loginUser.id}
            axiosUrl="http://localhost:8000/api/"
          />
        </>
      );
    }
  }
}

export default User_Detail;
