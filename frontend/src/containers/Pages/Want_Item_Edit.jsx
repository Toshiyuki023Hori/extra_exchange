import React, { Component } from 'react';
import axios from 'axios';
import styled from "styled-components"
import { Redirect } from 'react-router-dom';
import Want_Item_Edit_Form from '../Organisms/Want_Item_Edit_Form';
import Header from '../Organisms/Header';
import CircularProgress from '@material-ui/core/CircularProgress';
import { mixinHeaderSpace } from "../../presentational/shared/static/CSSvariables";
import Want_Item_List from '../Organisms/Want_Item_List';

class Want_Item_Edit extends Component {
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
    // setStateのレンダリング完了までスピナー
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <Body>
            <Want_Item_Edit_Form
              parent_id={this.props.match.params.parent_id}
              owner={this.state.loginUser}
              loginUser={this.state.loginUser}
              axiosUrl="http://localhost:8000/api/"
            />
          </Body>
        </>
      );
    }
  }
}

export default Want_Item_Edit;

const Body = styled.div`
  ${mixinHeaderSpace};
`;