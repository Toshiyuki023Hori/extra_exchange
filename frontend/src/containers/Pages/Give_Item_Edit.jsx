import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Give_Item_Edit_Form from '../Organisms/Give_Item_Edit_Form';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import User_Sidemenu from '../Organisms/User_Sidemenu';
import { mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Give_Item_Edit extends Component {
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
        <div>
          <Header loginUser={this.state.loginUser} />
          <Body>
            <User_Sidemenu user_id={this.state.loginUser.id} isUser="true" />
            <Styled_Give_Item_Edit_Form
              parent_id={this.props.match.params.parent_id}
              owner={this.state.loginUser}
              loginUser={this.state.loginUser}
              axiosUrl="http://localhost:8000/api/"
            />
          </Body>
          <Footer/>
        </div>
      );
    }
  }
}

export default withRouter(Give_Item_Edit);

const Body = styled.div`
  ${mixinHeaderSpace};
  display:flex;
`;

const Styled_Give_Item_Edit_Form = styled(Give_Item_Edit_Form)`
  flex:1;
  padding:20px 0px 0px 20px;
`;