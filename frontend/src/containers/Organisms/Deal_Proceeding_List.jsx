import React, { Component } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import Header from '../Organisms/Header';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Request_Deal_Table from '../../presentational/shared/Request_Deal_Table';

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
    const { axiosUrl, hostOrJoinUrl, loginUserKey, notLoginUserKey } = this.props;
    let requestDeals = {};
    let requestDealData = '';
    let dealsForState = {};

    await axios
      .get(axiosUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => this.setState({ loginUser: res.data }))
      .catch((err) => console.log(err));

    // loginUser = hostUserのRequest_Dealを全件取得
    await axios
      .get(axiosUrl + 'requestdeal/?' + hostOrJoinUrl + '=' + this.state.loginUser.id)
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
            .get(axiosUrl + url + requestDeals[requestDeal_id][key])
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
            .get(axiosUrl + 'deal/?request_deal=' + requestDeal_id)
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
            [loginUserKey]: this.state.loginUser.username,
          },
        };
      })
    );
    await replaceIdWithName('user/', notLoginUserKey, 'username');
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
    if (this.state.loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <Wrapper>
          <Request_Deal_Table
            requestDeal={this.state.allDeals}
            loginUser={this.state.loginUser}
            joinUserUrl="/deal/join/"
            hostUserUrl="/deal/host/"
            requestOrDeal="deal"
          />
        </Wrapper>
      );
    }
  }
}

export default Deal_Proceeding_List;

const Wrapper = styled.div`
  margin:2rem auto;
`;