import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import history from '../../history';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import Deal_Info_Table from '../../presentational/shared/Deal_Info_Table';
import Message_Zone from "../Organisms/Message_Zone"

class Deal_Detail_JoinUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginUser: '',
      requestDeal: '',
      deal: '',
      dealForTable: '',
    };
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let requestDeal;

    // parameterに対応したRequestDealとDealを取得
    await axios
      .all([
        axios.get(localhostUrl + 'user/' + localStorage.getItem('uid')),
        axios.get(localhostUrl + 'requestdeal/' + requestDeal_id),
        axios.get(localhostUrl + 'deal/?request_deal=' + requestDeal_id),
      ])
      .then(
        axios.spread((resUser, resReqDeal, resDeal) => {
          this.setState({ loginUser: resUser.data });
          requestDeal = resReqDeal.data;
          this.setState({ deal: resDeal.data[0] });
          console.log(resDeal.data[0]);
        })
      )
      .catch((err) => console.log(err));

    // Request_Deal.joinUser !== loginUserならリダイレクト
    if (requestDeal.joinUser !== this.state.loginUser.id) {
      history.push('/top');
    } else {
      const replaceIdWithName = async (url, target, value) => {
        await axios
          .get(localhostUrl + url + requestDeal[target])
          .then((res) => {
            requestDeal = { ...requestDeal, [target]: res.data[value] };
            console.log(requestDeal);
          })
          .catch((err) => console.log(err));
      };
  
      await replaceIdWithName('parent/', 'joinItem', 'name');
      await replaceIdWithName('parent/', 'hostItem', 'name');
      await replaceIdWithName('user/', 'hostUser', 'username');
  
      requestDeal = {
        ...requestDeal,
        meetingTime: this.state.deal.meetingTime,
        joinUserAccept: this.state.deal.joinUserAccept,
      };
  
      await this.setState({ requestDeal: requestDeal });
      this.setState({ loading: false });
    }

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
          <h1>取引詳細</h1>
          <Deal_Info_Table item={this.state.requestDeal} joinOrHost="join" />
          <Message_Zone
          loginUser={this.state.loginUser}
          deal_id={this.state.deal.id}
          axiosUrl="http://localhost:8000/api/"
          />
        </div>
      );
    }
  }
}

export default Deal_Detail_JoinUser;
