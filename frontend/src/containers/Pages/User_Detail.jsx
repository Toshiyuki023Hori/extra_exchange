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
import { mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class User_Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      user: '',
      wantItemsLength: '',
      giveItemsLength: '',
      pickupsLength: '',
    };
    this.getGiveItemsLength = this.getGiveItemsLength.bind(this);
    this.getWantItemsLength = this.getWantItemsLength.bind(this);
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

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const loginUser_id = localStorage.getItem('uid');
    const user_id = this.props.match.params.uid;
    
    // 他ログインユーザーの訪問 => 初回レンダーの条件にpickupsLengthを含めれない
    //　getUserより前に値取得
    if (user_id === loginUser_id) {
      await axios
        .get(localhostUrl + 'pickup/?choosing_user=' + loginUser_id)
        .then((res) => this.setState({ pickupsLength: res.data.length }))
        .catch((err) => console.log(err));
    }

    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    this.getUser(loginUser_id, 'loginUser');
    this.getUser(user_id, 'user');

  }

  // Want_Item_Listの個数を取得(propsとして渡す)
  getWantItemsLength = (length) => {
    this.setState({wantItemsLength : length})
  };

  getGiveItemsLength = (length) => {
    this.setState({giveItemsLength : length})
  };

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
        margin_left="30px"
        getWantItemsLength = {this.getWantItemsLength}
      />
    );

    const giveItemList = (
      <Give_Item_List_byUser
        margin_top="20px"
        margin_left="15px"
        owner={user.id}
        axiosUrl="http://localhost:8000/api/"
        getGiveItemsLength = {this.getGiveItemsLength}
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
                <p>{user.profile}</p>
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

                <p>{user.profile}</p>
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
