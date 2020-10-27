import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import axios from 'axios';
import history from '../../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import { Colors, mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Deal_Complete extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginUser: '',
      requestDeal: '',
    };
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let request_deal;
    let deal;
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    await axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    await axios
      .all([
        axios.get(localhostUrl + 'requestdeal/' + requestDeal_id),
        axios.get(localhostUrl + 'deal/?request_deal=' + requestDeal_id),
      ])
      .then(
        axios.spread(async (resReqDeal, resDeal) => {
          await this.setState({ requestDeal: resReqDeal.data });
          deal = resDeal.data[0];
        })
      )
      .catch((err) => console.log(err));

    console.log(deal);
    if (
      deal.completed === false ||
      (this.state.requestDeal.joinUser !== this.state.loginUser.id &&
        this.state.requestDeal.hostUser !== this.state.loginUser.id)
    ) {
      history.push('/top');
    }
    this.setState({ loading: false });
  }

  render() {
    let user_id;

    //loginUserじゃない方がuser_idに代入される。
    if (this.state.loginUser.id === this.state.requestDeal.joinUser) {
      user_id = this.state.requestDeal.hostUser;
    } else if (this.state.loginUser.id === this.state.requestDeal.hostUser) {
      user_id = this.state.requestDeal.joinUser;
    }

    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loading == true) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Header loginUser={this.state.loginUser} />
          <Body>
            <Subject>取引が完了しました</Subject>
            <Message>サービスをご利用いただきありがとうございました。</Message>
            <LinkDiv>
              <a href="/category">商品を探す</a>
              <a href={'/user/' + user_id}>今回の取引相手の他の商品をみる</a>
            </LinkDiv>
          </Body>
          <Footer />
        </div>
      );
    }
  }
}

export default Deal_Complete;

const Body = styled.div`
  ${mixinHeaderSpace};
  min-height:30rem;
  display:flex;
  flex-direction:column;
  justify-content:center;
`;

const Subject = styled.h1`
  padding: 2rem 0.5rem;
  margin: 0 auto;
  width: 11em;
  position: relative;
  font-size: 2.7rem;
  text-align: center;

  &::before {
    content: '';
    height: 4px;
    width: 9em;
    position: absolute;
    top: 2em;
    background: ${Colors.accent1};
  }
`;

const Message = styled.p`
  width: 25em;
  margin: 0 auto;
  font-size: 1.3rem;
  text-align: center;
`;

const LinkDiv = styled.div`
  margin:1em 0;
  display: flex;
  justify-content: space-around;

  a {
    display: block;
    text-decoration: none;
    color: ${Colors.accent1};
    font-size:1.3rem;

    &:hover {
      font-weight: bolder;
    }
  }
`;
