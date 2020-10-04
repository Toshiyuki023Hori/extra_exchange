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
    const topCategoryList = ['メンズ服', 'レディース服','ゲーム・書籍'];
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
    const header = (value) => {
      return <Header loginUser={value} />;
    };

    const giveItemList = (value) => {
      return (
        <Give_Item_List
          axiosUrl="http://localhost:8000/api/"
          h2title="の最新投稿一覧"
          loginUser={value}
          category={this.state.categories[0]}
        />
      );
    };

    if (!this.props.isAuthenticated) {
      return (
        <>
          {header('')}
          {giveItemList('')}
        </>
      );
    }
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          {header(this.state.loginUser)}
          {giveItemList(this.state.loginUser)}
        </>
      );
    }
  }
}

export default Top;
