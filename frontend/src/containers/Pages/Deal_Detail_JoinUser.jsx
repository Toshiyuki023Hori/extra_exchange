import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import history from '../../history';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import Deal_Info_Table from '../../presentational/shared/Deal_Info_Table';
import Message_Zone from "../Organisms/Message_Zone"
import MiddleButton from "../../presentational/shared/MiddleButton";

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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteDeal = this.deleteDeal.bind(this);
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
          // handleSubmit時にhostItem,joinItemのidを参照できるようにstate保持
          this.setState({requestDeal : resReqDeal.data});
          // Deal_Info_Tableに伝達用 = idがnameに置換される
          requestDeal = resReqDeal.data;
          this.setState({ deal: resDeal.data[0] });
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
    }; // replaceWithName  Closing
  
      await replaceIdWithName('parent/', 'joinItem', 'name');
      await replaceIdWithName('parent/', 'hostItem', 'name');
      await replaceIdWithName('user/', 'hostUser', 'username');
  
      requestDeal = {
        ...requestDeal,
        meetingTime: this.state.deal.meetingTime,
        joinUserAccept: this.state.deal.joinUserAccept,
      };
  
      await this.setState({ dealForTable: requestDeal });
      this.setState({ loading: false });
    }
  }
  // compoentDidMount closing


  handleSubmit = () => {
    const localhostUrl = 'http://localhost:8000/api/';
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    axios.patch(localhostUrl + "deal/" + this.state.deal.id + '/', {
      joinUserAccept: true
    },authHeader)
    .then((res) => {
      history.push("/deal/proceeding/join");
      window.alert("取引成立の報告が送信されました。");
    })
    .catch((err) => {
      console.log(err.response)
      window.alert(err.response.data);
    })
  };

  deleteDeal = () => {
    const localhostUrl = 'http://localhost:8000/api/';
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    let result = window.confirm("取引を削除しますか?\n削除した場合、リクエストも同時に削除されるため、同じ商品の取引にはもう一度リクエストを送り直す必要があります。")

    if(result){
      axios.delete(localhostUrl + "deal/" + this.state.deal.id,authHeader)
      .then((res) => {
        window.alert("削除に成功しました。")
        history.push("/deal/proceeding/join");
      })
      .catch((err) => {
        window.alert("申し訳ありません。削除に失敗しました。\n後ほど再びお試しください。")
      })
    }

  };


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
          <Deal_Info_Table item={this.state.dealForTable} joinOrHost="join" />
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
            <MiddleButton
            btn_name="取引成立"
            btn_type="submit"
            btn_click={this.handleSubmit}
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

export default Deal_Detail_JoinUser;
