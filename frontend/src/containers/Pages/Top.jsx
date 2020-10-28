import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import Give_Item_List from '../Organisms/Give_Item_List';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class Top extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginUser: '',
      categories: '',
    };
  }
  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const topCategoryList = ['メンズ服', 'レディース服', 'ゲーム'];
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
    this.setState({ loading: false });
  }

  render() {
    let giveItemView;
    let categoryList;
    const header = (value) => {
      return <Header loginUser={value} />;
    };

    const judgeLastIndex = (idx) => {
      if(this.state.categories.length-1 == idx){
        return true;
      }else{
        return false;
      }
    };

    if (this.state.categories != '') {
      categoryList = this.state.categories.map((category) => {
        return (
          <li key={category.id}>
            <CategoryLink href={'/category/' + category.id}>{category.name}</CategoryLink>
          </li>
        );
      });
    }

    if (this.state.categories != '') {
      giveItemView = this.state.categories.map((category, idx) => {
        return (
          <Styled_Give_Item_List
            key={idx}
            id={'#' + category.id}
            axiosUrl="http://localhost:8000/api/"
            h2title="の投稿一覧"
            category={category}
            margin_top="20px"
            margin_bottom="20px"
            position_left="3rem"
            noBorder={judgeLastIndex(idx)}
          />
        );
      });
    }

    // ゲスト用
    if (!this.props.isAuthenticated) {
      if (this.state.loading === true) {
        return <CircularProgress />;
      } else {
        return (
          <>
            {header('')}
            <Wrapper>
              <Category_Bar>
                <SubTitle>注目のカテゴリはこちら!</SubTitle>
                <CategoryList>{categoryList}</CategoryList>
                <Others>
                  <a href="/category/1">その他のカテゴリーをみる</a>
                </Others>
              </Category_Bar>
              {giveItemView}
            </Wrapper>
            <Footer />
          </>
        );
      } // else closing
    } // if (!this.props.isAuthenticated) closing // ログインユーザー用
    //
    if (this.state.loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <>
          {header(this.state.loginUser)}
          <Wrapper>
            <Category_Bar>
              <SubTitle>注目のカテゴリはこちら!</SubTitle>
              <CategoryList>{categoryList}</CategoryList>
              <Others>
                <a href="/category/1">その他のカテゴリーをみる</a>
              </Others>
            </Category_Bar>
            {giveItemView}
          </Wrapper>
          <Footer />
        </>
      ); // return closing
    } // else closing
  }
}

export default Top;

const Wrapper = styled.div`
  margin-top: 125px;
`;

const Category_Bar = styled.div`
  width:95%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
`;

const SubTitle = styled.p`
  grid-column: 1 / 3;
  text-align: center;
`;

const CategoryList = styled.ul`
  display: flex;
  list-style: none;
  justify-content: flex-end;

  li {
    margin-right: 35px;
    align-content: end;
  }
`;

const CategoryLink = styled.a`
  color: ${Colors.accent1};
  font-size: 1.25rem;
  text-decoration: none;

  &:hover {
    font-weight: bold;
  }
`;

const Others = styled.p`
  a {
    font-size: 1.25rem;
    color: ${Colors.accent1};
    cursor: pointer;
    text-decoration: none;

    &:hover {
      font-weight: bold;
    }
  }
`;

const Styled_Give_Item_List = styled(Give_Item_List)`
  width:95%;
  margin-left:auto;
  margin-right:auto;
`;