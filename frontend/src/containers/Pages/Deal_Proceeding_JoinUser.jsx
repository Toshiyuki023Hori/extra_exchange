import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Deal_Proceeding_List from "../Organisms/Deal_Proceeding_List";
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import { Colors, mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Deal_Proceeding_JoinUser extends Component {
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
          <Body>
            <StyledH2tag>あなたがジョインユーザーの進行中の取引</StyledH2tag>
            <Deal_Proceeding_List
              loginUser={this.state.loginUser}
              axiosUrl="http://localhost:8000/api/"
              hostOrJoinUrl="join_user"
              loginUserKey="joinUser"
              notLoginUserKey="hostUser"
              // host側は情報をloginUserとしてすでにレンダー時に持っているからjoinUserを呼び出し
            />
            <LinkDiv>
              <a href="/deal/proceeding/host">{this.state.loginUser.username}さんがホストの進行中の取引</a>
            </LinkDiv>
          </Body>
          <Footer/>
        </div>
      );
    }
  }
}

export default Deal_Proceeding_JoinUser;

const Body = styled.div`
  ${mixinHeaderSpace};
  min-height:30rem;
`;

const StyledH2tag = styled.h2`
  padding-top: 1.5rem;
  padding-left: 1.5rem;
`;

const LinkDiv = styled.div`
  text-align: center;

  a {
    display: inline-block;
    margin: 0 auto;
    text-decoration: none;
    font-size: 1.15rem;
    color: ${Colors.characters};
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0px;
      width: 100%;
      height: 2px;
      background: ${Colors.characters};
      transform: scale(0, 1);
      transform-origin: center top;
      transition: transform 0.3s;
    }

    &:hover {
      font-weight: 700;
    }
    &:hover::after {
      transform: scale(1, 1);
    }
`;