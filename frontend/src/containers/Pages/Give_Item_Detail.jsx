import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import Give_Item_Description from '../Organisms/Give_Item_Description';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import User_Description from '../Organisms/User_Description';
import Comment_Zone from '../Organisms/Comment_Zone';
import Give_Item_List_byUser from '../Organisms/Give_Item_List_byUser';
import { CircularProgress } from '@material-ui/core';
import { Colors, mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Give_Item_Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      parentItem: '',
      giveItem: '',
    };
    this.setGiveItem = this.setGiveItem.bind(this);
  }

  getAxios = (url, id, target) => {
    const localhostUrl = 'http://localhost:8000/api/';
    axios
      .get(localhostUrl + url + id)
      .then((res) => {
        console.log('res is ' + res.data);
        this.setState({ [target]: res.data });
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    const uid = localStorage.getItem('uid');
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    if (uid === null) {
      this.setState({ loginUser: 'なし' });
    } else {
      this.getAxios('user/', uid, 'loginUser');
    }
    this.getAxios('parent/', this.props.match.params.parent_id, 'parentItem');
  }

  setGiveItem = (giveItem_id) => {
    this.setState({ giveItem: giveItem_id });
  };

  render() {
    const { loginUser, parentItem, giveItem } = this.state;
    let userDescription;
    let giveItemList;
    // Give_Itemのオーナーが閲覧していた場合、編集と削除を許可。
    if (parentItem.owner !== loginUser.id) {
      userDescription = (
        <User_Description
          owner={parentItem.owner}
          loginUser={loginUser}
          axiosUrl="http://localhost:8000/api/"
        />
      );

      giveItemList = (
        <Give_Item_List_byUser owner={parentItem.owner} axiosUrl="http://localhost:8000/api/" />
      );
    }

    if (this.state.loginUser === '' || this.state.parentItem === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Header loginUser={loginUser} />
          <Body>
            <Give_Item_Description
              parent_id={parentItem.id}
              loginUser={loginUser}
              axiosUrl="http://localhost:8000/api/"
              setGiveItem={this.setGiveItem}
            />
            {userDescription}
            <Comment_Zone
              owner={parentItem.owner}
              giveItem={giveItem}
              loginUser={loginUser}
              axiosUrl="http://localhost:8000/api/"
            />
            {giveItemList}
          </Body>
          <Footer />
        </div>
      );
    }
  }
}

export default Give_Item_Detail;

const Body = styled.div`
  ${mixinHeaderSpace};
  width: 77%;
  margin-left: auto;
  margin-right: auto;
`;
