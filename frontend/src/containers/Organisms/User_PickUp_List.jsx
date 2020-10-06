import React, { Component } from 'react';
import axios from 'axios';
import SmallButton from '../../presentational/shared/SmallButton';
import { CircularProgress } from '@material-ui/core';

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
    const { axiosUrl, loginUser, length, updateNum } = this.props;

    await axios
      .get(axiosUrl + 'pickup/?choosingUser=' + loginUser.id)
      .then((res) => {
        this.setState({ pickupList: res.data });
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
          this.setState({ pickupList: res.data });
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
    let filteredPickUps = [];

    //
    const filteredUsers = choosingUser.filter((user_id) => user_id != this.state.loginUser.id);
    await axios
      .patch(
        axiosUrl + 'pickup/' + pickup_id + '/',
        {
          choosingUser: filteredUsers,
        },
        authHeader
      )
      .then((res) => {
        this.props.checkOwnPickUps();
      })
      .catch((err) => console.log(err));
  };

  render() {
    const { loginUser, pickupList } = this.state;
    if (pickupList === 'Before Loading') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <h3>現在の登録地点</h3>
          <div>
            <ul>
              {pickupList.map((pickup) => {
                return (
                  <>
                    <li key={pickup.id} id={pickup.id}>
                      {pickup.name}
                    </li>
                    <SmallButton
                      btn_name="削除"
                      btn_type="submit"
                      btn_click={() => this.handleDelete(pickup.id, pickup.choosingUser)}
                    />
                  </>
                );
              })}
            </ul>
          </div>
        </div>
      );
    }
  }
}

export default User_PickUp_List;
