import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import Header from '../Organisms/Header';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Request_Deal_Table from "../../presentational/shared/Request_Deal_Table";

class Deal_Proceeding_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginUser: '',
      allDeals: '',
    };
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let requestDeals = {};
    let requestDealData = '';
    let dealsForState = {};

    await axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => this.setState({ loginUser: res.data }))
      .catch((err) => console.log(err));

    // loginUser = hostUserのRequest_Dealを全件取得
    await axios
      .get(localhostUrl + 'requestdeal/?host_user=' + this.state.loginUser.id)
      .then((res) => {
        if (res.data.length > 0) {
          requestDealData = res.data;
        } else {
          requestDealData = '進行中の取引はありません。';
        }
      })
      .catch((err) => console.log(err));

    // requestDeal_idをkeyとし、fieldをpropertyとしてもつobjectを作成
    for (const requestDealObj of requestDealData) {
      requestDeals = { ...requestDeals, [requestDealObj.id]: requestDealObj };
    }

    const replaceIdWithName = async (url, key, value) => {
      await Promise.all(
        Object.keys(requestDeals).map(async (requestDeal_id) => {
          await axios
            .get(localhostUrl + url + requestDeals[requestDeal_id][key])
            .then(
              (res) =>
                (requestDeals = {
                  ...requestDeals,
                  [requestDeal_id]: { ...requestDeals[requestDeal_id], [key]: res.data[value] },
                })
            )
            .catch((err) => console.log(err));
        }) //  map closing
      ); //     Promise.all closing
    }; //          replaceIdWithName closing

    const fetchDealAndSetData = async (target1, target2, target3) => {
      await Promise.all(
        Object.keys(requestDeals).map(async (requestDeal_id) => {
          await axios
            .get(localhostUrl + 'deal/?request_deal=' + requestDeal_id)
            .then((res) => {
              if (res.data.length !== 0) {
                requestDeals = {
                  ...requestDeals,
                  [requestDeal_id]: {
                    ...requestDeals[requestDeal_id],
                    [target1]: res.data[0][target1],
                    [target2]: res.data[0][target2],
                    [target3]: res.data[0][target3],
                  },
                }; // requestDeals スプレッド構文 closing
              } // if (res.data.length !== 0) closing
            }) //  then closing
            .catch((err) => console.log(err));
        }) //   map closing
      ); //      Promise.all closing
    }; // fetchDealAndSetData closing

    // Request_Deal_Tableに渡すために、idからnameへ置換
    await Promise.all(
      Object.keys(requestDeals).map((requestDeal_id) => {
        requestDeals = {
          ...requestDeals,
          [requestDeal_id]: {
            ...requestDeals[requestDeal_id],
            hostUser: this.state.loginUser.username,
          },
        };
      })
    );
    await replaceIdWithName('user/', 'joinUser', 'username');
    await replaceIdWithName('parent/', 'hostItem', 'name');
    await replaceIdWithName('parent/', 'joinItem', 'name');

    await fetchDealAndSetData('completed', 'joinUserAccept', 'meetingTime');

    console.log(requestDeals);

    // dealしか持っていないPropertyを用いて、dealのみを抽出
    for (const requestDeal_id in requestDeals) {
      console.log(requestDeals[requestDeal_id]['meetingTime']);
      if (requestDeals[requestDeal_id]['meetingTime']) {
        dealsForState = { ...dealsForState, [requestDeal_id]: requestDeals[requestDeal_id] };
      }
    }

    // 一件も無い場合は、メッセージを代入。
    if (Object.keys(dealsForState).length === 0) {
      dealsForState = '進行中の取引はありません。';
    }

    console.log(dealsForState);

    await this.setState({ allDeals: dealsForState });
    this.setState({ loading: false });
  }

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
          <h1>進行中の取引一覧</h1>
          <Request_Deal_Table
            requestDeal={this.state.allDeals}
            loginUser={this.state.loginUser}
            jumpUrl="/deal/"
            requestOrDeal="deal"
          />
        </div>
      );
    }
  }
}

export default Deal_Proceeding_List;
