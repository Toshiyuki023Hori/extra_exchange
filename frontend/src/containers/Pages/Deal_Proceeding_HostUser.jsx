import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import Header from '../Organisms/Header';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Deal_Proceeding_List from "../Organisms/Deal_Proceeding_List";

class Deal_Proceeding_HostUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
    };
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';

    await axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => this.setState({ loginUser: res.data }))
      .catch((err) => console.log(err));
  }

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loginUser == "") {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Header loginUser={this.state.loginUser} />
          <h1>あなたがホストユーザーの進行中の取引</h1>
          <Deal_Proceeding_List
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
            hostOrJoinUrl="host_user"
            loginUserKey="hostUser"
            notLoginUserKey="joinUser"
          />
        </div>
      );
    }
  }
}

export default Deal_Proceeding_HostUser;
