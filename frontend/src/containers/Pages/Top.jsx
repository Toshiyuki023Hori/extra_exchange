import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import Give_Item_List from '../Organisms/Give_Item_List';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      categories: [],
    };
  }
  componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const topCategory = ['メンズ服', 'レディース服', '日用品', '生鮮食品', 'スマートフォン'];
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    topCategory.map((category) => {
      axios
        .get(localhostUrl + 'category/?name=' + category)
        .then((res) => this.setState({ categories: [...this.state.categories, res.data] }));
    });
  }

  render() {
    // 非認証ユーザーのリダイレクト
    if (!this.props.isAuthenticated) {
      return <p>開発中です。</p>;
    }
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <Give_Item_List subtitle="メンズの最新投稿一覧" category="" />
        </>
      );
    }
  }
}

export default Top;
