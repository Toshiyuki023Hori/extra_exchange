import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import SmallButton from '../../presentational/shared/SmallButton';

class User_PickUp_Add_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: this.props.loginUser,
      lines: '',
      stations: '',
      textInput: '',
      allLines: '',
      allStations: [],
    };
    this.handleChange = this.handleChange.bind(this);
  }

  spreadAndSetState = (key, value) => {
    this.setState({ ...this.state, [key]: value });
  };

  componentDidMount() {
    console.log('Original is ' + this.state.lines);
    axios
      .get('http://express.heartrails.com/api/json?method=getLines&prefecture=東京都')
      .then((res) => {
        this.setState({ allLines: res.data.response.line });
      })
      .catch((err) => console.log(err));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.lines != this.state.lines) {
      console.log('FIRE!!');
      axios
        .get('http://express.heartrails.com/api/json?method=getStations&line=' + this.state.lines)
        .then((res) => {
          this.setState({ allStations: res.data.response.station });
        })
        .catch((err) => console.log(err));
    }
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.spreadAndSetState(name, value);
  };

  handleSubmit = async () => {
    const { owner, lines, stations, textInput, allLines, allStations } = this.state;
    const { axiosUrl } = this.props;
    const token = localStorage.getItem('token');
    let pickupPlaces;
    let originalUsers = [];
    let pickup_id = '';
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    // 路線名だけ入力してSubmitされるのを防ぐ
    if (lines != '' && stations != '') {
      pickupPlaces = lines + ' ' + stations + '駅';
    } else if (textInput != '') {
      pickupPlaces = textInput;
    }

    //登録済みの駅かをgetリクエストで確認
    // ifで分岐させるために、awaitで非同期制御
    await axios
      .get(axiosUrl + 'pickup/?name=' + pickupPlaces)
      .then((res) => {
        pickup_id = res.data[0].id;
        res.data[0].choosingUser.map((user_id) => {
          originalUsers = [...originalUsers, user_id];
        });
      })
      .catch((err) => console.log(err));

    if (typeof pickup_id === 'number') {
      axios
        .patch(
          axiosUrl + 'pickup/' + pickup_id + '/',
          {
            choosingUser: [...originalUsers, owner.id],
          },
          authHeader
        )
        .then((res) => history.push("/user/pickup"))
        .catch((err) => console.log(err));
    } else {
      axios
        .post(
          axiosUrl + 'pickup/',
          {
            name: pickupPlaces,
            choosingUser: [owner.id],
          },
          authHeader
        )
        .then((res) => this.props.checkOwnPickUps())
        .catch((err) => window.alert('ピックアップ地点追加の登録に失敗しました。'));
    }
  };

  render() {
    const { permission } = this.props;
    const { owner, lines, stations, textInput, allLines, allStations } = this.state;
    let disableCondition;
    let alertMessage;
    if (!permission){
      disableCondition = true;
      alertMessage = <p>登録できるピックアップ地点は最大3件までです。</p>
    } else if (stations == '' && textInput == '') {
      disableCondition = true;
    } else if (stations != '' && textInput != '') {
      disableCondition = true;
      alertMessage = <p>ドロップダウンとテキストの両方が入力されています。</p>;
    }

    if (allLines === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <div>
            <h2>ピックアップ地点追加</h2>
            <select name="lines" disabled={stations != ''} onChange={this.handleChange}>
              <option value="">路線を選ぶ</option>
              {allLines.map((line, idx) => {
                return (
                  <option key={idx} value={line}>
                    {line}
                  </option>
                );
              })}
            </select>
            <select name="stations" onChange={this.handleChange}>
              <option value="">駅を選ぶ or 路線を選び直す</option>
              {allStations != '' &&
                allStations.map((line, idx) => {
                  // console.log(allStations)
                  return (
                    <option key={idx} value={line.name}>
                      {line.name}
                    </option>
                  );
                })}
            </select>
          </div>
          <div>
            <label>その他の地点をご希望の場合は直接ご記入ください(バス停など)</label>
            <input name="textInput" type="text" value={textInput} onChange={this.handleChange} />
          </div>
          {alertMessage}
          <SmallButton
            btn_name="追加"
            btn_type="submit"
            btn_click={this.handleSubmit}
            btn_disable={disableCondition}
          />
        </div>
      );
    }
  }
}

export default User_PickUp_Add_Form;
