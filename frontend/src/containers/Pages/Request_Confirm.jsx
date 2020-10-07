import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import styled from 'styled-components';
import history from '../../history';
import Header from '../Organisms/Header';
import Item_Table from '../../presentational/shared/Item_Table';
import Carousel from '../../presentational/shared/Carousel';
import MiddleButton from '../../presentational/shared/MiddleButton';

class Request_Confirm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        meetingTime: '',
        denied_reason: '',
      },
      message: {
        meetingTime: '',
      },
      loading: true,
      loginUser: '',
      requestDeal: '',
      hostItem: '',
      joinItem: '',
      itemImages: [],
      allMeeting: '',
      request_id: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.denyRequest = this.denyRequest.bind(this);
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let requestDeal;
    let joinItem_id;
    let request_id;
    let itemsForState = {};

    const setItemsForState = (id, key, value) => {
      itemsForState = {
        [id]: { ...itemsForState[id], [key]: value },
      };
    };

    // hostItem, hostUser, joinItem取得のためにRequest_Deal取得
    await axios
      .all([
        axios.get(localhostUrl + 'user/' + localStorage.getItem('uid')),
        axios.get(localhostUrl + 'requestdeal/' + requestDeal_id),
      ])
      .then(
        axios.spread(async (resUser, resReqDeal) => {
          console.log(resReqDeal.data);
          this.setState({ loginUser: resUser.data });
          this.setState({ requestDeal: resReqDeal.data });
          joinItem_id = resReqDeal.data.joinItem;
        })
      )
      .catch((err) => console.log(err)); // axios.all Closing

    // 閲覧者がhostUser以外ならリダイレクト
    if (this.state.requestDeal.hostUser != localStorage.getItem('uid')) {
      history.push('/top');
    }

    // Item_Tableに代入するためにjoinItemを取得
    await axios
      .all([
        axios.get(localhostUrl + 'parent/' + joinItem_id),
        axios.get(localhostUrl + 'parent/' + this.state.requestDeal.hostItem),
        axios.get(localhostUrl + 'giveitem/?parent_item=' + joinItem_id),
      ])
      .then(
        axios.spread((resJoin, resHost, resGive) => {
          itemsForState = { [resJoin.data.id]: resJoin.data };
          setItemsForState(joinItem_id, 'give_id', resGive.data[0].id);
          setItemsForState(joinItem_id, 'state', resGive.data[0].state);
          setItemsForState(joinItem_id, 'category', resGive.data[0].category);
          setItemsForState(joinItem_id, 'detail', resGive.data[0].detail);
          this.setState({ hostItem: resHost.data });
        })
      )
      .catch((err) => console.log(err));
    // axios.all Closing
    console.log(this.state.hostItem);

    // idから表示用にnameを取得、置換。
    await axios
      .all([
        axios.get(localhostUrl + 'bland/' + itemsForState[joinItem_id].bland),
        axios.get(localhostUrl + 'category/' + itemsForState[joinItem_id].category),
        axios.get(localhostUrl + 'user/' + itemsForState[joinItem_id].owner),
      ])
      .then(
        axios.spread((resBland, resCategory, resUser) => {
          setItemsForState(joinItem_id, 'bland', resBland.data.name);
          setItemsForState(joinItem_id, 'category', resCategory.data.name);
          setItemsForState(joinItem_id, 'owner', resUser.data.username);
        })
      )
      .catch((err) => console.log(err));
    // axios.all Closing

    axios.get(localhostUrl + 'image/?item=' + itemsForState[joinItem_id]['give_id']).then((res) => {
      res.data.map((imgObject) => {
        this.setState({ itemImages: [...this.state.itemImages, imgObject.image] });
      });
    });

    // Meeting取得のために、requestを取得、idを代入
    await axios
      .get(localhostUrl + 'request/?request_deal=' + this.state.requestDeal.id)
      .then((res) => {
        if (res.data.length !== 0) {
          request_id = res.data[0].id;
          this.setState({ request_id: res.data[0].id });
        }
      })
      .catch((err) => console.log(err));

    axios.get(localhostUrl + 'meeting/?request=' + request_id).then((res) => {
      if (res.data.length !== 0) {
        console.log(res);
        this.setState({ allMeeting: res.data });
      }
    });

    await this.setState({ joinItem: itemsForState });
    this.setState({ loading: false });
  }
  //
  //  //  //   //  //  //      componentDidMound Fin       //  //  //
  //

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const { info } = this.state;

    this.setState({
      info: { ...info, [name]: value },
    });
  };

  handleSubmit = async () => {
    const localhostUrl = 'http://localhost:8000/api/';
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const setMessageToState = (key, value) => {
      this.setState({ message: { ...this.state.message, [key]: value } });
    };

    // Submitする度に,エラーメッセージを初期化
    setMessageToState('meetingTime', '');
    //
    // meetingTimeが選択されているかのValidation
    if (this.state.info.meetingTime == '') {
      setMessageToState('meetingTime', '取引日時を決定してください。');
    } else {
      await axios
        .post(
          localhostUrl + 'deal/',
          {
            meetingTime: this.state.info.meetingTime,
            requestDeal: this.state.requestDeal.id,
          },
          authHeader
        )
        .then((res) => console.log(res.data))
        .catch((err) => {
          console.log(err.response);
          setMessageToState('meetingTime', err.response.data.meetingTime);
        });

      if (this.state.message.meetingTime == '') {
        axios
          .patch(
            localhostUrl + 'request/' + this.state.request_id + '/',
            {
              accepted: true,
            },
            authHeader
          )
          .then((res) => console.log(res.data))
          .catch((err) => console.log(err));
      }
    }
  };

  denyRequest = () => {
    console.log('yes');
  };

  render() {
    const { isAuthenticated } = this.props;
    const {
      loading,
      loginUser,
      hostItem,
      joinItem,
      requestDeal,
      itemImages,
      allMeeting,
    } = this.state;
    let meetingList;

    const convertData = (dataTime) => {
      const year = dataTime.slice(0, 4);
      const month = dataTime.slice(5, 7);
      const day = dataTime.slice(8, 10);
      const hour = dataTime.slice(11, 13);
      const min = dataTime.slice(14, 16);
      return `${year}年${month}月${day}日${hour}時${min}分`;
    };

    if (allMeeting.length > 0) {
      meetingList = allMeeting.map((meetingObject) => {
        return (
          <>
            <input
              name="meetingTime"
              value={meetingObject.whatTime}
              type="radio"
              onChange={this.handleChange}
            />
            <label>{convertData(meetingObject.whatTime)}</label>
          </>
        );
      });
    }

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Header loginUser={loginUser} />
          <div>
            <h1>リクエスト確認</h1>
            <div>
              <h2>リクエスト商品</h2>
              <p>{hostItem.name}</p>
            </div>
            <div>
              <h2>引き換え商品</h2>
              <Item_Table item={joinItem} parent_id={requestDeal.joinItem} />
              <Carousel images={itemImages} />
            </div>
            <div>
              <h2>希望場所</h2>
              <p>{requestDeal.pickups}</p>
            </div>
            <div>
              <h2>希望時間</h2>
              {meetingList}
              <p>{this.state.message.meetingTime}</p>
            </div>

            <MiddleButton
              btn_name="リクエストを承諾する"
              btn_type="submit"
              btn_click={this.handleSubmit}
            />
          </div>

          <div>
            <div>
              <p>拒否理由</p>
              <textarea
                name="denied_reason"
                onChange={this.handleChange}
                cols="30"
                rows="10"
              ></textarea>
            </div>
            <MiddleButton
              btn_name="リクエストを拒否する"
              btn_type="submit"
              btn_click={this.denyRequest}
            />
          </div>
        </div>
      );
    }
  }
}

export default Request_Confirm;
