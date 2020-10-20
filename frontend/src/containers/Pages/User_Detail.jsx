import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import User_Header from '../Organisms/User_Header';
import Want_Item_List from '../Organisms/Want_Item_List';
import Give_Item_List_byUser from '../Organisms/Give_Item_List_byUser';
import Footer from '../Organisms/Footer';
import User_Sidemenu from '../Organisms/User_Sidemenu';
import { Colors ,mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

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
    const localhostUrl = 'http://localhost:8000/api/';
    const loginUser_id = localStorage.getItem('uid');
    const user_id = this.props.match.params.uid;

    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    this.getUser(loginUser_id, 'loginUser');
    this.getUser(user_id, 'user');
  }

  render() {
    const { loginUser, user, pickupsLength, wantItemsLength, giveItemsLength } = this.state;
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
        margin_left="30px"
      />
    );

    const giveItemList = (
      <Give_Item_List_byUser
        margin_top="20px"
        margin_left="15px"
        owner={user.id}
        axiosUrl="http://localhost:8000/api/"
      />
    );

    const userHeader = <User_Header user={user} />;

    // ゲスト用
    if (!this.props.isAuthenticated && user == '') {
      return <CircularProgress />;
    } else if (!this.props.isAuthenticated && user != '') {
      return (
        <>
          <Wrapper>
            {header('')}
            <Body>
              <User_Sidemenu user_id={user.id} />
              <InformationDiv>
                {userHeader}
                {user.profile && 
                  <UserProfile>{user.profile}</UserProfile>
                }
                {wantItemList}
                {giveItemList}
              </InformationDiv>
            </Body>
            <Footer />
          </Wrapper>
        </>
      );
    }

    // loginUser本人用
    else if (loginUser === '' || user === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Wrapper>
            {header(loginUser)}
            <Body>
              <User_Sidemenu user_id={user.id} isUser={loginUser.id === user.id} />
              <InformationDiv>
                {userHeader}
                {user.profile && 
                  <UserProfile>{user.profile}</UserProfile>
                }
                {wantItemList}
                {giveItemList}
              </InformationDiv>
            </Body>
            <Footer />
          </Wrapper>
        </>
      );
    }
  }
}

export default User_Detail;

const Wrapper = styled.div`
  ${mixinHeaderSpace}
`;

const Body = styled.div`
  display: flex;
`;

const InformationDiv = styled.div`
  flex: 1;
`;

const UserProfile = styled.p`
  width: 70%;
  border: 3.5px dashed ${Colors.accent1};
  border-radius: 5%;
  padding: 10px 18px;
  margin: 25px auto;
  white-space:pre-wrap;
`;
