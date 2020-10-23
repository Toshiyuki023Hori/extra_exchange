import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Redirect } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import User_Sidemenu from '../Organisms/User_Sidemenu';
import User_ChangePass_Form from '../Organisms/User_ChangePass_Form';
import { mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class User_ChangePass extends Component {
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
    if (!this.props.isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (this.state.loginUser === '') {
      return <CircularProgress />;
    } else {
      return (
        <>
          <Header loginUser={this.state.loginUser} />
          <Body>
            <User_Sidemenu user_id={this.state.loginUser.id} isUser="true" />
            <Styled_User_ChangePass_Form
              loginUser={this.state.loginUser}
              authUrl="http://localhost:8000/rest-auth/password/change/"
            />
          </Body>
          <Footer />
        </>
      );
    }
  }
}

export default User_ChangePass;

const Body = styled.div`
  ${mixinHeaderSpace};
  display: flex;
  height: 70vh;
`;

const Styled_User_ChangePass_Form = styled(User_ChangePass_Form)`
  flex: 1;
  padding: 20px 0px 0px 20px;
`;
