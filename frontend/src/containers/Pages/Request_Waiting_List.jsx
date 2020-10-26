import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import history from '../../history';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Request_Deal_Table from '../../presentational/shared/Request_Deal_Table';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import { Colors, mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Request_Waiting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginUser: '',
      allRequests: '',
    };
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let requestsForState = {};
    let allRequestDeal = '';

    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    await axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    await axios
      .get(localhostUrl + 'requestdeal/?join_user=' + this.state.loginUser.id)
      .then((res) => {
        if (res.data.length !== 0) {
          allRequestDeal = res.data;
        } else {
          requestsForState = '送信された取引リクエストはありません。';
        }
      })
      .catch((err) => console.log(err));

    if (requestsForState !== '送信された取引リクエストはありません。') {
      // 各情報をrequest_deal毎にまとめるためにkeyがrequest_deal_idのオブジェクトを作成。
      for (const requestDealObj of allRequestDeal) {
        requestsForState = { ...requestsForState, [requestDealObj.id]: requestDealObj };
      }

      // requestsForStateのidを表示用にnameに置換する関数
      const replaceIdWithName = async (url, key, value) => {
        await Promise.all(
          Object.keys(requestsForState).map(async (requestDeal_id) => {
            await axios
              .get(localhostUrl + url + requestsForState[requestDeal_id][key])
              .then((res) => {
                requestsForState = {
                  ...requestsForState,
                  [requestDeal_id]: { ...requestsForState[requestDeal_id], [key]: res.data[value] },
                };
              })
              .catch((err) => console.log(err));
          }) // map closing
        ); //   Promise.all closing
      }; //          replaceIdWithName closing

      // request_deal_id = request.idのRequestを取得し、dataをrequestsForStateへセットする関数
      const fetchRequestAndSetData = async (url, key) => {
        await Promise.all(
          Object.keys(requestsForState).map(async (requestDeal_id) => {
            await axios
              .get(localhostUrl + url + requestDeal_id)
              .then((res) => {
                // RequestはRequest_Dealが存在する際は必ず存在
                //　したがって条件分岐でres.data.length === 0とデータが無い場合を考慮する必要なし。
                console.log(res.data);
                requestsForState = {
                  ...requestsForState,
                  [requestDeal_id]: {
                    ...requestsForState[requestDeal_id],
                    [key]: res.data[0][key],
                  },
                };
              })
              .catch((err) => console.log(err));
          }) // map closing
        ); //   Promise.all closing
      }; //          fetchRequestAndSetData closing

      // Idから表示用に名前を取得。
      await replaceIdWithName('parent/', 'joinItem', 'name');
      await replaceIdWithName('parent/', 'hostItem', 'name');
      await replaceIdWithName('user/', 'hostUser', 'username');

      // requestの状態を取引状況を取得(tableで状況によって表示を変えるため)
      await fetchRequestAndSetData('request/?request_deal=', 'denied');
      await fetchRequestAndSetData('request/?request_deal=', 'accepted');
    } // if(requestsForState.length > 0) closing

    await this.setState({ allRequests: requestsForState });
    this.setState({ loading: false });
  }
  //
  // componentDidMount Closing
  //

  render() {
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Header loginUser={this.state.loginUser} />
          <Body>
            <StyledH2tag>送信したリクエスト一覧</StyledH2tag>
            <Styled_Request_Deal_Table
              requestDeal={this.state.allRequests}
              loginUser={this.state.loginUser}
              jumpUrl="/request/"
              parentType="join"
              requestOrDeal="request"
            />
            <LinkDiv>
              <a href="/request/applied">
                {this.state.loginUser.username}さんへ送信されたリクエストを見る
              </a>
            </LinkDiv>
          </Body>
          <Footer />
        </div>
      );
    }
  }
}

export default Request_Waiting;

const Body = styled.div`
  ${mixinHeaderSpace};
  min-height: 30rem;
`;

const StyledH2tag = styled.h2`
  padding-top: 1.5rem;
  padding-left: 1.5rem;
`;

const Styled_Request_Deal_Table = styled(Request_Deal_Table)`
  margin: 2rem 0rem;
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
