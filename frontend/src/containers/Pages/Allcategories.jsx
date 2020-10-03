import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Category_List from '../Organisms/Category_List';
import Header from '../Organisms/Header';
import Give_Item_List from '../Organisms/Give_Item_List';

class Allcategories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      pickedCategory: '',
    };
    this.setCategoryToState = this.setCategoryToState.bind(this);
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

  // Category_ListからクリックされたcategoryをpickedCategoryへ渡す。
  setCategoryToState = (categoryObj) => {
    this.setState({ pickedCategory: categoryObj });
  };

  render() {
    //   //   //   //jsx内のvariable, function 始まり
    //
    const header = (value) => {
      return <Header loginUser={value} />;
    };

    const categoryList = (
      <Category_List
        axiosUrl="http://localhost:8000/api/"
        setCategoryToState={this.setCategoryToState}
      />
    );

    const giveItemList = (
      <Give_Item_List
        axiosUrl="http://localhost:8000/api/"
        h2title="カテゴリの投稿一覧"
        category={this.state.pickedCategory}
      />
    );

    //
    //   //   //   //jsx内のvariable, function 終わり

    if (!this.props.isAuthenticated) {
      return (
        <>
          {header('')}
          <h3>カテゴリ一覧</h3>
          {categoryList}
          {giveItemList}
        </>
      );
    }

    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          {header(this.state.loginUser)}
          <h3>カテゴリ一覧</h3>
          {categoryList}
          {giveItemList}
        </>
      );
    }
  }
}

export default Allcategories;
