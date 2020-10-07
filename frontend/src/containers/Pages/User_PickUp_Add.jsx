import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import Header from '../Organisms/Header';
import SmallButton from '../../presentational/shared/SmallButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import history from '../../history';
import User_PickUp_Add_Form from '../Organisms/User_PickUp_Add_Form';
import User_PickUp_List from '../Organisms/User_PickUp_List';
import TouchRipple from '@material-ui/core/ButtonBase/TouchRipple';

class User_PickUp_Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      permissionAdd: true,
      numOwnPickUps: '',
    };
    this.switchPermission = this.switchPermission.bind(this);
    this.updateNum = this.updateNum.bind(this);
    this.checkOwnPickUps = this.checkOwnPickUps.bind(this);
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

  componentDidUpdate(prevProps, prevState){
    if(prevState.numOwnPickUps != this.state.numOwnPickUps){
      this.switchPermission();
    }
  }

  switchPermission = () => {
    if (this.state.numOwnPickUps >= 3) {
      this.setState({ permissionAdd: false });
    } else if (!this.state.numOwnPickUps < 3) {
      this.setState({ permissionAdd: true });
    }
  };

  updateNum = (value) => {
    this.setState({numOwnPickUps:value})
  };

  // User_Pickup_Add_FormでSubmit完了後に発火
  // 追加後に新しいnumOwnPickUpsを取得
  // これによりswitchPermission発火
  checkOwnPickUps = async () => {
    console.log("now is " + this.state.numOwnPickUps);
    const localhostUrl = 'http://localhost:8000/api/';
    await axios
    .get(localhostUrl + 'pickup/?choosingUser=' + this.state.loginUser.id)
    .then((res) => {
      this.setState({ numOwnPickUps: res.data.length });
    })
    .catch((err) => console.log(err));
    console.log("After " + this.state.numOwnPickUps)
  };

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
          <User_PickUp_Add_Form
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
            permission={this.state.permissionAdd}
            checkOwnPickUps={this.checkOwnPickUps}
          />
          <User_PickUp_List
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
            permission={this.state.permissionAdd}
            len={this.state.numOwnPickUps}
            updateNum={this.updateNum}
            checkOwnPickUps={this.checkOwnPickUps}
          />
        </>
      );
    }
  }
}

export default User_PickUp_Add;
