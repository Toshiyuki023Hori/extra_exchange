import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Want_Item_List from '../Organisms/Want_Item_List';
import Icon from '../../presentational/shared/Icon';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class User_Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    };
  }
  componentDidMount() {
    const { owner, axiosUrl } = this.props;
    axios
      .get(axiosUrl + 'user/' + owner)
      .then((res) => this.setState({ user: res.data }))
      .catch((err) => console.log(err));
  }

  render() {
    const { user } = this.state;
    const { loginUser } = this.props;
    if (user == '') {
      return null;
    } else {
      return (
        <Wrapper>
          <Icon_Div>
            <Icon icon={user.icon} img_width="70px" img_height="70px" img_radius="50%" />
            <h1>{user.username}</h1>
          </Icon_Div>
          <Want_Item_List
            owner={user}
            loginUser={loginUser}
            h2Title={user.username + 'さんの欲しい物リスト'}
            axiosUrl="http://localhost:8000/api/"
            margin_top='1.3rem'
          />
        </Wrapper>
      );
    }
  }
}

export default User_Description;

const Wrapper = styled.div`
  margin-top:2rem;
  border-top: 2px solid ${Colors.accent1};
`;

const Icon_Div = styled.div`
  margin-top:2rem;
  display:flex;
  align-items:center;

  h1{
    margin-left:2rem;
  }
`;