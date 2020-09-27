import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Give_Item_Edit_Form from '../Organisms/Give_Item_Edit_Form';
import Header from '../Organisms/Header';

class Give_Item_Edit extends Component {
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
    // 非認証ユーザーのリダイレクト
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Header loginUser={this.state.loginUser} />
          <Give_Item_Edit_Form
            parent_id={this.props.match.params.parent_id}
            owner={this.state.loginUser}
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
          />
        </div>
      );
    }
  }
}

export default withRouter(Give_Item_Edit);
