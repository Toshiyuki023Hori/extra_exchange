import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Category_List from '../Organisms/Category_List';
import Header from '../Organisms/Header';
import Give_Item_List from '../Organisms/Give_Item_List';
import { mixinSpace } from "../../presentational/shared/static/CSSvariables";

class Category_Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
      category: '',
    };
  }
  componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット

   axios.get(localhostUrl + 'user/' + localStorage.getItem('uid'))
   .then((res) => this.setState({loginUser : res.data}))
   .catch((err) => console.log(err));

  axios.get(localhostUrl + 'category/' + this.props.match.params.category_id)
  .then((res) => {
    this.setState({category : res.data})
    console.log(res.data);
  })
  .catch((err) => console.log(err));
  }


  render() {
    //   //   //   //jsx内のvariable, function 始まり
    //
    const header = (value) => {
      return <Header loginUser={value} />;
    };

    const categoryList = (
      <Category_List
        axiosUrl="http://localhost:8000/api/"
      />
    );

    const giveItemList = (
      <Give_Item_List
        axiosUrl="http://localhost:8000/api/"
        h2title="カテゴリの投稿一覧"
        category={this.state.category}
      />
    );

    //
    //   //   //   //jsx内のvariable, function 終わり

    if (!this.props.isAuthenticated) {
      if(this.state.category == ""){
        return <CircularProgress/>
      }else{
        return (
          <>
            {header('')}
            <Wrapper>
              <h3>カテゴリ一覧</h3>
              {categoryList}
              {giveItemList}
            </Wrapper>
          </>
        );
      }
    }

    if (this.state.loginUser == '' || this.state.category == "") {
      return <CircularProgress />;
    } else {
      return (
        <>
          {header(this.state.loginUser)}
          <Wrapper>
            <h3>カテゴリ一覧</h3>
            {categoryList}
            {giveItemList}
          </Wrapper>
        </>
      );
    }
  }
}

export default Category_Page;

const Wrapper = styled.div`
  ${mixinSpace}
`;