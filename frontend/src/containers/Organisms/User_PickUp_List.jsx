import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import SmallButton from '../../presentational/shared/SmallButton';
import { CircularProgress } from '@material-ui/core';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class User_PickUp_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: this.props.loginUser,
      pickupList: 'Before Loading',
      lengthPickUps: '',
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  async componentDidMount() {
    const { axiosUrl, loginUser, updateNum } = this.props;

    await axios
      .get(axiosUrl + 'pickup/?choosingUser=' + loginUser.id)
      .then((res) => {
        if(res.data.length === 0){
          this.setState({pickupList : '登録されているピックアップ地点はありません。'})
        } else {
          this.setState({ pickupList: res.data });
        }
      })
      .catch((err) => console.log(err));
    
    updateNum(this.state.pickupList.length);
  }

  //  checkOwnNumが発火した時に起動
  // 再度pickupを挿入する(新規追加時と削除時)。
  async componentDidUpdate(prevProps, prevState) {
    const { len, axiosUrl, loginUser } = this.props;
    if (prevProps.len != len) {
      await axios
        .get(axiosUrl + 'pickup/?choosingUser=' + loginUser.id)
        .then((res) => {
          if(res.data.length === 0){
            this.setState({pickupList : '登録されているピックアップ地点はありません。'})
          } else {
            this.setState({ pickupList: res.data });
          }
        })
        .catch((err) => console.log(err));
    }
    console.log(this.state.pickupList);
  }

  handleDelete = async (pickup_id, choosingUser) => {
    const { axiosUrl, updateNum } = this.props;
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const result = window.confirm('このピックアップ地点を削除してもよろしいですか?');

    if(result){
      const selectedUsers = choosingUser.filter((user_id) => user_id != this.state.loginUser.id);
      await axios
        .patch(
          axiosUrl + 'pickup/' + pickup_id + '/',
          {
            choosingUser: selectedUsers,
          },
          authHeader
        )
        .then((res) => {
          this.props.checkOwnPickUps();
        })
        .catch((err) => console.log(err));
    }
  };

  render() {
    const { loginUser, pickupList } = this.state;
    let pickupView;

    console.log(pickupList.length);

    if(pickupList === '登録されているピックアップ地点はありません。' && pickupList !== 'Before Loading'){
      pickupView = <NotHaveText>{pickupList}</NotHaveText>;
    } else if(pickupList.length > 0 && pickupList !== 'Before Loading') {
      pickupView = (
        <StyledList>
          {pickupList.map((pickup) => {
            return (
              <>
                <li key={pickup.id} id={pickup.id}>
                  <SpanText>{pickup.name}</SpanText>
                  <StyledSmallButton
                    btn_name="削除"
                    btn_type="submit"
                    btn_click={() => this.handleDelete(pickup.id, pickup.choosingUser)}
                    btn_back={Colors.accent2}
                    btn_text_color={Colors.subcolor1}
                  />
                </li>
              </>
            );
          })}
        </StyledList>
      )
    }

    if (pickupList === 'Before Loading') {
      return <CircularProgress />;
    } else {
      return (
        <Wrapper>
          <h2>現在の登録地点</h2>
          <div>
            {pickupView}
          </div>
        </Wrapper>
      );
    }
  }
}

export default User_PickUp_List;

const Wrapper = styled.div`
  margin-top: 30px;
`;

const StyledList = styled.ul`
  margin-top: 15px;
  margin-left: 30px;
  list-style: none;

  li {
    font-size: 1.15rem;
    margin-bottom: 17px;
  }
`;

const SpanText = styled.span`
  display: inline-block;
  margin-right: 60px;
  width: 380px;
`;

const StyledSmallButton = styled(SmallButton)`
  border: none;
`;

const NotHaveText = styled.p`
  margin-top: 15px;
  margin-left: 30px;
  font-size: 1.15rem;
`;