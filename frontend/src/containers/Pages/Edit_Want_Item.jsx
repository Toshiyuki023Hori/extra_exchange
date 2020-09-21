import React, { Component } from 'react';
import axios from 'axios';
import { withRouter } from 'react-router-dom';
import Edit_Want_Item_Form from '../Organisms/Edit_Want_Item_Form';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';

class Edit_Want_Item extends Component {
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
        <>
          <Header loginUser={this.state.loginUser} />
          <Edit_Want_Item_Form parent_id={this.props.match.params.parent_id} owner={this.state.loginUser} loginUser={this.state.loginUser} axiosUrl="http://localhost:8000/api/" />
        </>
      );
    }
  }
}

export default Edit_Want_Item;
