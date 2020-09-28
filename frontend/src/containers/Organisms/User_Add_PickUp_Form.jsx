import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import SmallButton from '../../presentational/shared/SmallButton';

class User_Add_PickUp_Form extends Component {
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
        console.log(res.data);
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

  handleSubmit = () => {
    const { owner, lines, stations, textInput, allLines, allStations } = this.state;
    const { axiosUrl } = this.props;
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const pickupPlaces = lines + ' ' + stations + '駅';
    axios
      .post(
        axiosUrl + 'pickup/',
        {
          name: pickupPlaces,
          choosingUser: [owner.id],
        },
        authHeader
      )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  };

  render() {
    const { owner, lines, stations, textInput, allLines, allStations } = this.state;
    let mapStations;
    if (allLines === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <div>
            <h2>ピックアップ地点追加</h2>
            <select name="lines" onChange={this.handleChange}>
              <option value="">路線を選んでください</option>
              {allLines.map((line, idx) => {
                return (
                  <option key={idx} value={line}>
                    {line}
                  </option>
                );
              })}
            </select>
            <select name="stations" onChange={this.handleChange}>
              <option value="">駅を選んでください</option>
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
          <SmallButton btn_name="追加" btn_type="submit" btn_click={this.handleSubmit} />
        </div>
      );
    }
  }
}

export default User_Add_PickUp_Form;
