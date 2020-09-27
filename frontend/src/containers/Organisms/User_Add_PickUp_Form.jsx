import React, { Component } from 'react';
import SmallButton from '../../presentational/shared/SmallButton';
import styled from 'styled-components';
import history from '../../history';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';

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
      console.log("FIRE!!")
      axios
        .get('http://express.heartrails.com/api/json?method=getStations&line=' + this.state.lines)
        .then((res) => {
          res.data.response.station.map((station) => {
            this.setState({allStations :[...this.state.allStations, station.name]})
          })
        });
    }
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    // console.log("Change is " + this.state.allStations)
    this.spreadAndSetState(name, value);
  };

  render() {
    const { owner, lines, stations, textInput, allLines, allStations } = this.state;
    let mapStations;
    if (allLines === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <h2>ピックアップ地点追加</h2>
          <select name="lines" onChange={this.handleChange}>
            <option value="">路線を選んでください</option>
            {allLines.map((line) => {
              return <option value={line}>{line}</option>;
            })}
          </select>
          <select name="stations" onChange={this.handleChange}>
            <option value="">駅を選んでください</option>
            {
            allStations != '' &&
            allStations.map((line) => {
              // console.log(allStations)
            return <option value={line}>{line}</option>;
            })
            }
          </select>
        </div>
      );
    }
  }
}

export default User_Add_PickUp_Form;
