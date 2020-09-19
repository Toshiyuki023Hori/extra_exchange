import React, { Component } from 'react';
import axios from 'axios';
import Add_Want_Item_Form from '../Organisms/Add_Want_Item_Form';
import Want_Item_List from '../Organisms/Want_Item_List';
import CircularProgress from '@material-ui/core/CircularProgress';

class Add_Want_Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
    };
  }

  componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));
  }

  render() {
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Add_Want_Item_Form owner={this.state.loginUser} loginUser={this.state.loginUser} axiosUrl="http://localhost:8000/api/" />
          <Want_Item_List
            owner={this.state.loginUser}
            loginUser={this.state.loginUser}
            h2Title={'現在の欲しい物リスト'}
            axiosUrl="http://localhost:8000/api/"
          />
        </div>
      );
    }
  }
}

export default Add_Want_Item;
