import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Header from '../Organisms/Header';
import SmallButton from '../../presentational/shared/SmallButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import history from '../../history';
import User_Add_PickUp_Form from '../Organisms/User_Add_PickUp_Form';

class User_Add_PickUp extends Component {
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
          <User_Add_PickUp_Form
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
          />
        </>
      );
    }
  }
}

export default User_Add_PickUp;
