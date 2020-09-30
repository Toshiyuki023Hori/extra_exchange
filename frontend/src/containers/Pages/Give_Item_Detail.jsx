import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import Give_Item_Description from '../Organisms/Give_Item_Description';
import Header from '../Organisms/Header';

class Give_Item_Detail extends Component {
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
      return <p>編集詳細ビューは開発中です。</p>;
    } else {
      return (
        <div>
          <Header loginUser={this.state.loginUser} />
          <Give_Item_Description
            parent_id={this.props.match.params.parent_id}
            axiosUrl="http://localhost:8000/api/"
          />
        </div>
      );
    }
  }
}

export default Give_Item_Detail;

