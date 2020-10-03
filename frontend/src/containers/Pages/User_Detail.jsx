import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import User_Header from '../Organisms/User_Header';
import Want_Item_List from '../Organisms/Want_Item_List';
import Give_Item_List_byUser from '../Organisms/Give_Item_List_byUser';

class User_Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      user: '',
    };
  }

  getUser = (uid, key) => {
    const localhostUrl = 'http://localhost:8000/api/';
    axios
      .get(localhostUrl + 'user/' + uid)
      .then((res) => {
        this.setState({ [key]: res.data });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    this.getUser(localStorage.getItem('uid'), 'loginUser');
    this.getUser(this.props.match.params.uid, 'user');
  }

  render() {
    const { loginUser, user } = this.state;
    const header = (value) => {
      return <Header loginUser={value} />;
    };

    const wantItemList = (
      <Want_Item_List
        owner={this.state.user}
        // 編集・削除ボタンを表示させないため空白
        loginUser=""
        h2Title={'欲しい物リスト'}
        axiosUrl="http://localhost:8000/api/"
      />
    );

    const giveItemList = (
      <Give_Item_List_byUser owner={user.id} axiosUrl="http://localhost:8000/api/" />
    );

    const userHeader = <User_Header user={user} />;

    if (!this.props.isAuthenticated && user == "") {
      return <CircularProgress/>
    } else if (!this.props.isAuthenticated && user != ''){
        return (
          <>
            {header('')}
            {userHeader}
            <p>{user.profile}</p>
            {wantItemList}
            {giveItemList}
          </>
        );
    }
    
    else if (loginUser === '' || user === "") {
      return <CircularProgress />;
    } else {
      return (
        <>
          {header(loginUser)}
        {userHeader}
          <p>{user.profile}</p>
          {wantItemList}
          {giveItemList}
        </>
      );
    }
  }
}

export default User_Detail;
