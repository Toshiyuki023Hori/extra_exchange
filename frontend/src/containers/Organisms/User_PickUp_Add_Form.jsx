import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';
import axios from 'axios';
import { CircularProgress } from '@material-ui/core';
import MiddleButton from '../../presentational/shared/MiddleButton';
import ValidationMessage from '../../presentational/shared/ValidationMessage';
import { Colors, mixinUlLabel, mixinDropDown, mixinInputForm, mixinLiTag } from '../../presentational/shared/static/CSSvariables';

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

    // DBに存在している場合は、PATCHでUserを追加
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
    } 
    // DBに存在していない場合はPOSTで新規作成。
    else {
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
      alertMessage = 
      <ValidationMessage
        errorMessage='登録できるピックアップ地点は最大3件までです。'
        isShowup={!permission}
        text_color="#FF737A"
        margin="10px 0px 0px 200px"
        bg_color="#FFBFC2"
      />
    } else if (stations == '' && textInput == '') {
      disableCondition = true;
    } else if (stations != '' && textInput != '') {
      disableCondition = true;
      alertMessage = 
      <ValidationMessage
        errorMessage='ドロップダウンとテキストの両方が入力されています。'
        isShowup={stations != '' && textInput != ''}
        text_color="#FF737A"
        margin="10px 0px 0px 200px"
        bg_color="#FFBFC2"
      />
    }

    if (allLines === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>

          <h2>ピックアップ地点追加</h2>

          <FormArea>
            <StyledLiTag>
              <label>ドロップダウンで追加</label>
              <DropDown name="lines" disabled={stations != ''} onChange={this.handleChange}>
                <option value="">路線を選ぶ</option>
                {allLines.map((line, idx) => {
                  return (
                    <option key={idx} value={line}>
                      {line}
                    </option>
                  );
                })}
              </DropDown>
              <DropDown name="stations" onChange={this.handleChange}>
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
              </DropDown>
            </StyledLiTag>
            <StyledLiTag>
              <OtherLabel>テキストで追加</OtherLabel>
              <InputForm name="textInput" type="text" value={textInput} onChange={this.handleChange} />
            </StyledLiTag>

            {alertMessage}

            <StyledLiTag>
              <SubmitButton
                btn_type="submit"
                btn_click={this.handleSubmit}
                btn_disable={disableCondition}
                >
                追加
              </SubmitButton>
            </StyledLiTag>
          </FormArea>
        </div>
      );
    }
  }
}

export default User_PickUp_Add_Form;

const FormArea = styled.ul`
  label{
    ${mixinUlLabel};
    width:170px;
    margin-right:30px;
  }
`;

const DropDown = styled.select`
  ${mixinDropDown};
  width:250px;
  margin-right:45px;
`;

const InputForm = styled.input`
  ${mixinInputForm};
`;

const StyledLiTag = styled.li`
  ${mixinLiTag};
  margin-top:15px;
`;

const OtherLabel = styled.label`
  &::after{
    content:'その他の地点の追加(バス停など)';
    display: block;
    font-weight: normal;
    font-size: 0.7rem;
  }
`;

const SubmitButton = styled(MiddleButton)`
  display: block;
  margin: 10px auto;
  background: ${(props) => (!props.btn_disable ? '#8DD6FF' : '#E0F4FF')};
  color: ${(props) => (!props.btn_disable ? '#466A80' : '#BDCFDA')};
  box-shadow: 4px 3px ${Colors.accent1};

  &:hover:enabled {
    background-color: #a8e0ff;
    transition: all 200ms linear;
  }

  &:active:enabled {
    box-shadow: 0px 0px 0px;
    transform: translate(4px, 3px);
  }
`;