import React, { Component } from 'react';
import axios from 'axios';

import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import User_Edit_Form from '../Organisms/User_Edit_Form';
import Header from '../Organisms/Header';


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
          <User_Edit_Form
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
          />
        </>
      );
    }
  }
}

export default UserEdit;
