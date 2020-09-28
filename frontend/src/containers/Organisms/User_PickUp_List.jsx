import React, { Component } from 'react';
import axios from 'axios';
import SmallButton from '../../presentational/shared/SmallButton';

class User_PickUp_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: this.props.loginUser,
      pickupList: [],
    };
  }
  componentDidMount() {
    const { axiosUrl, loginUser } = this.props;

    axios.get(axiosUrl + '');
  }

  render() {
    return (
      <div>
        <h3>現在の登録地点</h3>
      </div>
    );
  }
}

export default User_PickUp_List;
