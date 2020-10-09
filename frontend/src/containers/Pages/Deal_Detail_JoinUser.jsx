import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import history from '../../history';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';

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
        })
      )
      .catch((err) => console.log(err));

    // Request_Deal.joinUser !== loginUserならリダイレクト
    if (requestDeal.joinUser !== this.state.loginUser.id) {
      history.push('/top');
    } else {
      console.log(requestDeal);
    }

    this.setState({loading : false})
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
        </div>
      );
    }
  }
}

export default Deal_Detail_JoinUser;
