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
      categories: '',
    };
  }
  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const topCategoryList = ['ゲーム・書籍', 'メンズ服', 'レディース服'];
    let passCategoryToState = [];
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    await axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    await Promise.all(
      topCategoryList.map(async (category) => {
        await axios.get(localhostUrl + 'category/?name=' + category).then((res) => {
          passCategoryToState = [...passCategoryToState, res.data[0]];
          console.log(passCategoryToState);
        });
      })
    );

    this.setState({ categories: passCategoryToState });
  }

  render() {
    // 非認証ユーザーのリダイレクト
    if (!this.props.isAuthenticated) {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <Give_Item_List
            axiosUrl="http://localhost:8000/api/"
            subtitle="の最新投稿一覧"
            loginUser=''
            category={this.state.categories[0]}
          />
        </>
      );
    }
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <Give_Item_List
            axiosUrl="http://localhost:8000/api/"
            subtitle="の最新投稿一覧"
            loginUser={this.state.loginUser}
            category={this.state.categories[0]}
          />
        </>
      );
    }
  }
}

export default Top;
