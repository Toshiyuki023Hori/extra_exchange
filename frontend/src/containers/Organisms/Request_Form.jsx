import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import MiddleButton from '../../presentational/shared/MiddleButton';
import history from "../../history";

class Request_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        joinItem: '',
        pickup: '',
        date1: '',
        date2: '',
        date3: '',
        note: '',
      },
      message: {
        joinItem: '',
        pickup: '',
        date1: '',
        date2: '',
        date3: '',
      },
      loading: true,
      allItems: {},
      allPickup: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount() {
    const { joinUser, hostUser, axiosUrl } = this.props;
    let itemsForState = {};
    let pickupForState = [];
    let parentItems = {};

    await axios
      .all([
        axios.get(axiosUrl + 'parent/?owner=' + joinUser.id),
        axios.get(axiosUrl + 'pickup/?choosingUser=' + hostUser),
      ])
      .then(
        axios.spread((resParent, resPickup) => {
          if (resParent.data.length !== 0) {
            resParent.data.map((parentObj) => {
              parentItems = { ...parentItems, [parentObj.id]: { name: parentObj.name } };
            });
            if (resPickup.data.length !== 0) {
              resPickup.data.map((pickupObj) => {
                pickupForState = [...pickupForState, pickupObj];
              });
            } else {
              pickupForState = '未登録';
            }
          } else {
            itemsForState = '商品が投稿されていません';
          }
        }) // axios.spread closing
      ); //    then closing

    console.log(pickupForState);
    console.log(parentItems);

    if (Object.keys(parentItems).length !== 0) {
      await Promise.all(
        // UserのParent_ItemからGive_Itemのみを取得
        Object.keys(parentItems).map(async (parent_id) => {
          await axios
            .get(axiosUrl + 'giveitem/?parent_item=' + parent_id)
            .then((res) => {
              if (res.data.length !== 0) {
                parentItems = {
                  ...parentItems,
                  [parent_id]: {
                    ...parentItems[parent_id],
                    give_id: res.data[0].id,
                  },
                }; // itemForState(スプレッド) closing
              } //    if(res.data.length !== 0) closing
            }) //     then closing
            .catch((err) => console.log(err));
          //  axios.get Fin
        }) //       map closing
      ); //         Promise.all Closing

      // itemForStateからGiveItemのみを抽出
      for (const key in parentItems) {
        if (parentItems[key]['give_id']) {
          itemsForState = { ...itemsForState, [key]: parentItems[key] };
        }
      }
    }

    if (Object.keys(itemsForState).length !== 0) {
      await Promise.all(
        Object.keys(itemsForState).map(async (parent_id) => {
          await axios
            .get(axiosUrl + 'image/?item=' + itemsForState[parent_id]['give_id'])
            .then(
              (res) =>
                (itemsForState = {
                  ...itemsForState,
                  [parent_id]: { ...itemsForState[parent_id], image: res.data },
                }) // itemsForState(スプレッド) closing
            ) //       then closing
            .catch((err) => console.log(err));
        }) // map closing
      ); //    Promise all closing
    } else {
      itemsForState = '商品が投稿されていません';
    }

    await this.setState({ allPickup: pickupForState });
    await this.setState({ allItems: itemsForState });
    this.setState({ loading: false });
  }
  //
  //    /////    /////   ////    ComponentDidMound　終わり

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const { info } = this.state;

    this.setState({
      info: { ...info, [name]: value },
    });
  };

  //           ===========           ===========
  //           Validation            ===========
  //           ===========           ===========

  validator(name, value) {
    switch (name) {
      case 'date1':
        return this.dateValidation(value);
      case 'date2':
        return this.dateValidation(value);
      case 'date3':
        return this.dateValidation(value);
    }
  }

  // // //  //                          //  //
  //  //  //  //  handleSubmit  //  //  //  //
  // // //  //                          //  //

  handleSubmit = async () => {
    const { axiosUrl, joinUser, hostUser, hostItem } = this.props;
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    let meetingList = [];
    let meeting_ids = [];
    let newMeetings = [];
    let originalRequest = {};
    let request_id;
    let reqDeal_id;

    let result = window.confirm(
    'こちらのリクエストを送信しますか？\n送信後は編集は行えません(削除をすることはできます)。'
    );

    if (result) {
      const hasValueInMeeting = (meeting) => {
        if (meeting != '') {
          meetingList = [...meetingList, meeting];
        } else {
        }
      };

      hasValueInMeeting(this.state.info.date1);
      hasValueInMeeting(this.state.info.date2);
      hasValueInMeeting(this.state.info.date3);

      const setMessageToState = (key, value) => {
        this.setState({ message: { ...this.state.message, [key]: value } });
      };

      // Validationに引っかかった後に、再送信をした後、前回のValidationの影響を消すため。
      this.setState({
        message: {
          joinItem: '',
          pickup: '',
          date1: '',
          date2: '',
          date3: '',
        },
      });

      // Validation(joinItem未入力)
      if (this.state.info.joinItem == '') {
        setMessageToState('joinItem', '交換する商品を選んでください。');
        // Validation(pickup未入力)
      } else if (this.state.info.pickup == '') {
        setMessageToState('pickup', 'ピックアップ場所を選んでください。');
        // Validation(date未入力)
      } else if (
        this.state.info.date1 == '' &&
        this.state.info.date2 == '' &&
        this.state.info.date3 == ''
      ) {
        setMessageToState('date1', '取引日時を決めてください。');
      } else {
        // はじめに、既存のMeeting_TimeがDBに存在しているか確認
        await Promise.all(
          meetingList.map(async (meeting) => {
            await axios
              .get(axiosUrl + 'meeting/?what_time=' + meeting)
              .then((res) => {
                console.log('meeting');
                console.log(res.data);
                if (res.data.length !== 0) {
                  meeting_ids = [...meeting_ids, res.data[0].id];
                } else {
                  newMeetings = [...newMeetings, meeting];
                }
              }) // then closing
              .catch((err) => console.log(err));
          }) //   map closing
        ); //      Promise.all Closing
        console.log('Exists ' + meeting_ids);
        console.log('New ' + newMeetings);

        // 新規meetingだけ事前にモデル作成
        // 先にモデルを作ることで、過去の日付のValidationも兼ねる
        if (newMeetings.length !== 0) {
          await Promise.all(
            newMeetings.map(async (meeting) => {
              await axios
                .post(axiosUrl + 'meeting/', { whatTime: meeting }, authHeader)
                .then((res) => {
                  meeting_ids = [...meeting_ids, res.data.id];
                })
                // 過去の日付ならErrorメッセージをstateにセット
                .catch((err) => setMessageToState('date1', err.response.data.whatTime));
            }) // map closing
          ); //    Promise.all closing
        } //      if(newMeetings.length !== 0) closing
        console.log('meeting_ids is ' + meeting_ids);

        // if内が全てのValidationをクリアしてからの処理。
        // 親モデル Request_Deal => 子モデル Request作成
        if (this.state.message.date1 == '') {
          await axios
            .post(
              axiosUrl + 'requestdeal/',
              {
                pickups: this.state.info.pickup,
                joinUser: joinUser.id,
                hostUser: hostUser,
                joinItem: this.state.info.joinItem,
                hostItem: hostItem,
              },
              authHeader
            )
            .then((res) => {
              console.log(res);
              reqDeal_id = res.data.id;
            })
            .catch((err) => console.log(err.responsee));

          console.log('reqDeal_id is ' + reqDeal_id);

          await axios
            .post(
              axiosUrl + 'request/',
              {
                note: this.state.info.note,
                requestDeal: reqDeal_id,
              },
              authHeader
            )
            .then((res) => {
              console.log(res);
              request_id = res.data.id;
            })
            .catch((err) => console.log(err.responsee));

          console.log('reqest_id is ' + request_id);

          await Promise.all(
            meeting_ids.map(async (meeting) => {
              await axios
                .get(axiosUrl + 'meeting/' + meeting)
                .then((res) => {
                  originalRequest = { ...originalRequest, [res.data.id]: res.data.request };
                })
                .catch((err) => console.log(err));
            })
          );

          for (const key in originalRequest) {
            originalRequest[key].push(request_id);
          }

          for (const key in originalRequest) {
          axios
              .patch(
                axiosUrl + 'meeting/' + key + '/',
                {
                  request: originalRequest[key],
                },
                authHeader
              )
              .then((res) => console.log('You did it ! \n' + res.data))
              .catch((err) => console.log(err));
          }

          history.push("request/check")
        } //if (this.state.message.date1 == '') end
      } //  else closing
    } //    if(result) closing
  };

  //////////
  /////////////     以下 render view      /////////
  /////////
  render() {
    let itemsView;
    let pickupsView;

    if (this.state.allItems !== '商品が投稿されていません') {
      itemsView = Object.keys(this.state.allItems).map((parent_id) => {
        return (
          <>
            <input name="joinItem" value={parent_id} type="radio" onChange={this.handleChange} />
            <label>{this.state.allItems[parent_id].name}</label>
          </>
        );
      });
    } else {
      itemsView = <p>{this.state.allItems}</p>;
    }

    if (this.state.allPickup !== '未登録') {
      pickupsView = this.state.allPickup.map((pickupObj) => {
        return (
          <>
            <input name="pickup" value={pickupObj.name} type="radio" onChange={this.handleChange} />
            <label>{pickupObj.name}</label>
          </>
        );
      });
    } else {
      pickupsView = <p>{this.state.allPickup}</p>;
    }

    if (this.state.loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <div>
            <h3>引き換える商品(あなたの出品リストより)</h3>
            {itemsView}
            <p>{this.state.message.joinItem}</p>
          </div>
          <div>
            <h3>ピックアップ地点(出品者のピックアップ地点より)</h3>
            {pickupsView}
            <p>{this.state.message.pickup}</p>
          </div>
          <div>
            <h3>取引希望日時(第3希望まで選んでください)</h3>
            <p>
              <p>{this.state.message.date1}</p>
              <label>日程候補1</label>
              <input name="date1" type="datetime-local" onChange={this.handleChange} />
            </p>
            <p>
              <p>{this.state.message.date2}</p>
              <label>日程候補2</label>
              <input name="date2" type="datetime-local" onChange={this.handleChange} />
            </p>
            <p>
              <p>{this.state.message.date3}</p>
              <label>日程候補3</label>
              <input name="date3" type="datetime-local" onChange={this.handleChange} />
            </p>
          </div>
          <div>
            <h3>補足</h3>
            <textarea name="note" id="" cols="30" rows="10"></textarea>
          </div>
          <MiddleButton
            btn_name="リクエストを送る"
            btn_type="submit"
            btn_click={this.handleSubmit}
          />
        </div>
      );
    }
  }
}

export default Request_Form;
