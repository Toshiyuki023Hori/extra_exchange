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
  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const topCategoryList = ['メンズ服', 'レディース服', 'スマートフォン'];
    let passCategoryToState=[]
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    await Promise.all(
      topCategoryList.map(async (category) => {
        await axios.get(localhostUrl + 'category/?name=' + category).then((res) => {
          passCategoryToState=[...passCategoryToState, res.data]
          console.log(passCategoryToState);
        });
      })
    );

    this.setState((state) => {return {categories : passCategoryToState}})
  }

  render() {
    // 非認証ユーザーのリダイレクト
    if (!this.props.isAuthenticated) {
      return <p>非ユーザー画面は開発中です。</p>;
    }
    if (this.state.loginUser === '' ) {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <Give_Item_List
            axiosUrl="http://localhost:8000/api/"
            subtitle="メンズの最新投稿一覧"
            loginUser={this.state.loginUser}
            category={this.state.categories[0]}
          />
        </>
      );
    }
  }
}

export default Top;
