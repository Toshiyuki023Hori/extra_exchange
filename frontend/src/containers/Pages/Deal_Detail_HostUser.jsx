import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import history from '../../history';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import Deal_Info_Table from '../../presentational/shared/Deal_Info_Table';
import Message_Zone from "../Organisms/Message_Zone";
import MiddleButton from "../../presentational/shared/MiddleButton";

class Deal_Detail_HostUser extends Component {
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

    // Request_Deal.hostUser !== loginUserならリダイレクト
    if (requestDeal.hostUser !== this.state.loginUser.id) {
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
      await replaceIdWithName('user/', 'joinUser', 'username');

      console.log('Deal is ');
      console.log(this.state.deal);
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
    let alertMessage;

    // ボタンのdisabledと同時にメッセージも表示。
    if(!this.state.deal.joinUserAccept){
      alertMessage = <p>ジョインユーザーからの取引成立報告がまだありません。</p>
    }
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
          <Deal_Info_Table item={this.state.requestDeal} joinOrHost="host" />
          <Message_Zone
          loginUser={this.state.loginUser}
          deal_id={this.state.deal.id}
          axiosUrl="http://localhost:8000/api/"
          />
          <div>
            <h3>取引完了までの流れ</h3>
            <p>
              ジョインユーザーの取引成立の報告 → ホストユーザーの取引完了の報告 → 終了
            </p>
            {alertMessage}
            <MiddleButton
            btn_name="取引成立"
            btn_type="submit"
            btn_click={this.handleSubmit}
            btn_disable={!this.state.deal.joinUserAccept}
            />
            <MiddleButton
            btn_name="取引をキャンセルする"
            btn_type="submit"
            btn_click={this.deleteDeal}
            />
          </div>
        </div>
      );
    }
  }
}

export default Deal_Detail_HostUser;
