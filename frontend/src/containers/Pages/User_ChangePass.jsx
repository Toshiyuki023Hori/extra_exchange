import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from '../Organisms/Header';
import User_ChangePass_Form from '../Organisms/User_ChangePass_Form';

class User_ChangePass extends Component {
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
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <User_ChangePass_Form
            loginUser={this.state.loginUser}
            authUrl="http://localhost:8000/rest-auth/password/change/"
          />
        </>
      );
    }
  }
}

export default User_ChangePass;
