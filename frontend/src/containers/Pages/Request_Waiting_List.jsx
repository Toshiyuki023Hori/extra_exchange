import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import history from '../../history';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Request_Deal_Table from '../../presentational/shared/Request_Deal_Table';
import Header from '../Organisms/Header';

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
          allRequestDeal = '送信された取引リクエストはありません。';
        }
      })
      .catch((err) => console.log(err));

    // 各情報をrequest_deal毎にまとめるためにkeyがrequest_deal_idのオブジェクトを作成。
    for (const requestDealObj of allRequestDeal) {
      requestsForState = { ...requestsForState, [requestDealObj.id]: requestDealObj };
    }

    // requestsForStateのidを表示用にnameに置換する関数
    const replaceIdWithName = async (url, key, value) => {
      await Promise.all(
        Object.keys(requestsForState).map(async (id) => {
          await axios
            .get(localhostUrl + url + requestsForState[id][key])
            .then((res) => {
              requestsForState = {
                ...requestsForState,
                [id]: { ...requestsForState[id], [key]: res.data[value] },
              };
            })
            .catch((err) => console.log(err));
        }) // map closing
      ); //   Promise.all closing
    }; //          replaceIdWithName closing

    // request_deal_id = request.idのRequestを取得し、dataをrequestsForStateへセットする関数
    const fetchRequestAndSetData = async (url, key) => {
      await Promise.all(
        Object.keys(requestsForState).map(async (id) => {
          await axios
            .get(localhostUrl + url + id)
            .then((res) => {
              console.log(res.data);
              requestsForState = {
                ...requestsForState,
                [id]: { ...requestsForState[id], [key]: res.data[0][key] },
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
          <h1>送信したリクエスト一覧</h1>
          <Request_Deal_Table
            requestDeal={this.state.allRequests}
            loginUser={this.state.loginUser}
            jumpUrl="/request/"
            parentType="join"
            requestOrDeal="request"
          />
        </div>
      );
    }
  }
}

export default Request_Waiting;
