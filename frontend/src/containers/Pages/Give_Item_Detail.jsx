import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import Give_Item_Description from '../Organisms/Give_Item_Description';
import Header from '../Organisms/Header';
import User_Description from '../Organisms/User_Description';
import Chat_Place from '../Organisms/Chat_Place';

class Give_Item_Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      owner: '',
      giveItem: '',
    };
    this.setOwner = this.setOwner.bind(this);
    this.setGiveItem = this.setGiveItem.bind(this);
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

  setOwner = (owner_id) => {
    this.setState({ owner: owner_id });
  };

  setGiveItem = (giveItem_id) => {
    this.setState({ giveItem: giveItem_id });
  };

  render() {
    const { loginUser, owner, giveItem } = this.state;
    if (this.state.loginUser === '') {
      return <p>編集詳細ビューは開発中です。</p>;
    } else {
      return (
        <div>
          <Header loginUser={loginUser} />
          <Give_Item_Description
            parent_id={this.props.match.params.parent_id}
            loginUser={loginUser}
            axiosUrl="http://localhost:8000/api/"
            setOwner={this.setOwner}
            setGiveItem={this.setGiveItem}
          />
          <User_Description
            owner={owner}
            loginUser={loginUser}
            axiosUrl="http://localhost:8000/api/"
          />
          <Chat_Place
            owner={owner}
            giveItem={giveItem}
            loginUser={loginUser}
            axiosUrl="http://localhost:8000/api/"
          />
        </div>
      );
    }
  }
}

export default Give_Item_Detail;
