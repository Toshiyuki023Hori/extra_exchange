import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import CircularProgress from '@material-ui/core/CircularProgress';
import Give_Item_Add_Form from '../Organisms/Give_Item_Add_Form';
import Header from '../Organisms/Header';
import Footer from "../Organisms/Footer";
import { mixinSpace } from "../../presentational/shared/static/CSSvariables";

class Give_Item_Add extends Component {
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
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <Wrapper>
          <Header loginUser={this.state.loginUser} />
          <Give_Item_Add_Form
            owner={this.state.loginUser}
            loginUser={this.state.loginUser}
            axiosUrl="http://localhost:8000/api/"
          />
          <Footer/>
        </Wrapper>
      );
    }
  }
}

export default withRouter(Give_Item_Add);

const Wrapper = styled.div`
  ${mixinSpace}
`;