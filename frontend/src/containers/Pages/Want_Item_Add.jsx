import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import Want_Item_Add_Form from '../Organisms/Want_Item_Add_Form';
import Want_Item_List from '../Organisms/Want_Item_List';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import User_Sidemenu from '../Organisms/User_Sidemenu';
import CircularProgress from '@material-ui/core/CircularProgress';
import { mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Want_Item_Add extends Component {
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
            {/* Want_Item_AddはloginUser.idで決定 > 常にtrue */}
            <User_Sidemenu user_id={this.state.loginUser.id} isUser="true" />
            <Want_Item_Div>
              <Want_Item_Add_Form
                owner={this.state.loginUser}
                loginUser={this.state.loginUser}
                axiosUrl="http://localhost:8000/api/"
              />
              <Want_Item_List
                owner={this.state.loginUser}
                loginUser={this.state.loginUser}
                h2Title={'現在の欲しい物リスト'}
                axiosUrl="http://localhost:8000/api/"
                margin_top="30px"
              />
            </Want_Item_Div>
          </Body>
          <Footer/>
        </div>
      );
    }
  }
}

export default withRouter(Want_Item_Add);

const Body = styled.div`
  ${mixinHeaderSpace};
  display:flex;
`;

const Want_Item_Div = styled.div`
  flex:1;
  padding:20px 0px 0px 20px;
`;
