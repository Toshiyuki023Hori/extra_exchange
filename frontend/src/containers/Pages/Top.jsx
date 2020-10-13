import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from "styled-components";
import Give_Item_List from '../Organisms/Give_Item_List';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import { mixinHeaderSpace } from "../../presentational/shared/static/CSSvariables";

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true,
      loginUser: '',
      categories: '',
    };
  }
  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const topCategoryList = ['メンズ服', 'レディース服','カバン'];
    let categoriesList = [];
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    await axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ loginUser: res.data });
      })
      .catch((err) => console.log(err));

    const mapCategoryName = (value) => {
      categoriesList = [...categoriesList, value];
    };
      
    await Promise.all(
      topCategoryList.map(async (category) => {
        await axios.get(localhostUrl + 'category/?name=' + category).then(async (res) => {
          await mapCategoryName(res.data[0]);
          console.log(categoriesList);
        });
      })
    );

    await this.setState({ categories: categoriesList });
    this.setState({loading : false});
    console.log(this.state.categories);
  }

  render() {
    let giveItemView;
    const header = (value) => {
      return <Header loginUser={value} />;
    };

    if(this.state.categories != ""){
      giveItemView = this.state.categories.map((category) => {
        return (
          <Give_Item_List
          axiosUrl="http://localhost:8000/api/"
          h2title="の投稿一覧"
          category={category}
          />
        )
      })
    }
    

    // ゲスト用
    if (!this.props.isAuthenticated) {
      if(this.state.loading === true){
        return <CircularProgress />;
      } else{
        return (
          <>
            {header('')}
            <ListDiv>
              {giveItemView}
            </ListDiv>
          </>
        );
      } // else closing
    }  // if (!this.props.isAuthenticated) closing
    //
　　// ログインユーザー用
    if (this.state.loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <>
          {header(this.state.loginUser)}
          <ListDiv>
            {giveItemView}
          </ListDiv>
        </>
      ); // return closing
    }    // else closing
  }
}

export default Top;

const ListDiv = styled.div`
  ${mixinHeaderSpace}
`;