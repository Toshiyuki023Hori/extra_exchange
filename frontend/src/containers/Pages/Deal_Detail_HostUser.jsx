import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';
import history from '../../history';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import CircularProgress from '@material-ui/core/CircularProgress';
import Deal_Info_Table from '../../presentational/shared/Deal_Info_Table';
import Message_Zone from '../Organisms/Message_Zone';
import MiddleButton from '../../presentational/shared/MiddleButton';
import { Colors, mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

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
          // handleSubmit時にhostItem,joinItemのidを参照できるようにstate保持
          this.setState({ requestDeal: resReqDeal.data });
          // Deal_Info_Tableに伝達用 = idがnameに置換される
          requestDeal = resReqDeal.data;
          this.setState({ deal: resDeal.data[0] });
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

      await this.setState({ dealForTable: requestDeal });
      this.setState({ loading: false });
    }
  }
  // componentDidMount  Closing

  handleSubmit = async () => {
    const localhostUrl = 'http://localhost:8000/api/';
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const deal_id = this.state.deal.id;
    let doneCompleted;
    let doneHost_give;
    let doneJoin_give;
    let hostItem_give_id;
    let joinItem_give_id;

    // patchリクエスト送信用function
    await axios
      .patch(
        localhostUrl + 'deal/' + deal_id + '/',
        {
          completed: true,
        },
        authHeader
      )
      .then((res) => {
        console.log(res.data);
        doneCompleted = res.data.completed;
      })
      .catch((err) => console.log('Error happened when sending completed'));
    // completedに更新されているのが確認されたら
    if (doneCompleted === true) {
      console.log('Stage2');
      await axios
        .all([
          axios.get(localhostUrl + 'giveitem/?parent_item=' + this.state.requestDeal.hostItem),
          axios.get(localhostUrl + 'giveitem/?parent_item=' + this.state.requestDeal.joinItem),
        ])
        .then(
          axios.spread((resHost, resJoin) => {
            hostItem_give_id = resHost.data[0].id;
            joinItem_give_id = resJoin.data[0].id;
            console.log(hostItem_give_id);
            console.log(joinItem_give_id);
          })
        )
        .catch((err) => console.log(err));

      await axios
        .patch(
          localhostUrl + 'giveitem/' + hostItem_give_id + '/',
          {
            doneDeal: true,
          },
          authHeader
        )
        .then((res) => {
          console.log(res.data);
          doneHost_give = res.data.doneDeal;
        })
        .catch((err) => console.log('Error happened when sending doneHostGive'));

      if (doneHost_give === true) {
        await axios
          .patch(
            localhostUrl + 'giveitem/' + joinItem_give_id + '/',
            {
              doneDeal: true,
            },
            authHeader
          )
          .then((res) => {
            console.log(res.data);
            doneJoin_give = res.data.doneDeal;
          })
          .catch((err) => console.log('Error happened when sending doneJoinGive'));

        if (doneJoin_give === true) {
          axios
            .post(
              localhostUrl + 'history/',
              {
                asHost: this.state.requestDeal.hostUser,
                asJoin: this.state.requestDeal.joinUser,
                deal: deal_id,
              },
              authHeader
            )
            .then((res) => history.push('/deal/complete/' + this.props.match.params.requestDeal_id))
            .catch((err) => console.log('Error happened when sending history'));
        } //  if(doneJoin_give === true) closing
      } //  if(doneHost_give === true) closing
    } //   if(doneCompleted === true) closing
  };

  render() {
    let alertMessage;
    let submitButton;
    let deleteButton;

    if (this.state.deal.completed) {
      submitButton = (
        <MiddleButton
          btn_name="取引は完了しました"
          btn_type="submit"
          btn_click={this.handleSubmit}
          btn_disable="true"
        />
      );

      deleteButton = <MiddleButton btn_name="報告後は削除できません" btn_disable="true" />;
    } else {
      submitButton = (
        <MiddleButton
          btn_name="取引成立"
          btn_type="submit"
          btn_click={this.handleSubmit}
          btn_disable={!this.state.deal.joinUserAccept}
        />
      );

      deleteButton = (
        <MiddleButton
          btn_name="取引をキャンセルする"
          btn_type="submit"
          btn_click={this.deleteDeal}
          btn_disable={this.state.deal.joinUserAccept}
        />
      );
    }

    // ボタンのdisabledと同時にメッセージも表示。
    if (!this.state.deal.joinUserAccept) {
      alertMessage = (
        <p>
          ジョインユーザーからの取引成立報告がまだありません(報告後は取引の削除ができなくなります)。
        </p>
      );
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
          <Body>
            <h1>取引詳細</h1>
            <Styled_Deal_Info_Table item={this.state.dealForTable} joinOrHost="host" />
            <Message_Zone
              loginUser={this.state.loginUser}
              deal_id={this.state.deal.id}
              axiosUrl="http://localhost:8000/api/"
              hostUser={this.state.requestDeal.hostUser}
            />
            <div>
              <h3>取引完了までの流れ</h3>
              <p>ジョインユーザーの取引成立の報告 → ホストユーザーの取引完了の報告 → 終了</p>
              {alertMessage}
              {submitButton}
              {deleteButton}
            </div>
          </Body>
        </div>
      );
    }
  }
}

export default Deal_Detail_HostUser;

const Body = styled.div`
  ${mixinHeaderSpace};
  width: 77%;
  margin-left: auto;
  margin-right: auto;
`;

const Styled_Deal_Info_Table = styled(Deal_Info_Table)`
  margin: 1rem auto;
`;
