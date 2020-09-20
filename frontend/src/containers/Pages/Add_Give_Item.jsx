import React, { Component } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Add_Give_Item_Form from '../Organisms/Add_Give_Item_Form';
import Header from '../Organisms/Header';

class Add_Give_Item extends Component {
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
          <Header loginUser={this.state.loginUser} />
          <Add_Give_Item_Form
            owner={this.state.loginUser}
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
          />
        </div>
      );
    }
  }
}

export default Add_Give_Item;
