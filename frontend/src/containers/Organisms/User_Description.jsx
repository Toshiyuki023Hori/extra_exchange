import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CircularProgress from '@material-ui/core/CircularProgress';
import Want_Item_List from '../Organisms/Want_Item_List';
import Icon from "../../presentational/shared/Icon";

class User_Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
    };
  }
  componentDidUpdate(prevProps) {
    const { owner, axiosUrl } = this.props;
    if (prevProps.owner != owner) {
      axios
        .get(axiosUrl + 'user/' + owner)
        .then((res) => this.setState({ user: res.data }))
        .catch((err) => console.log(err));
    }
  }

  render() {
    const { user } = this.state;
    const { loginUser } = this.props;
    if(user == ''){
        return <CircularProgress/>
    } else {
        return (
            <DescriptionWrapper>
                <Icon icon={user.icon} img_width="65px" img_height="65px" img_radius="50%"/>
                <h1>{user.username}</h1>
                <Want_Item_List
                owner={user}
                loginUser={loginUser}
                h2Title={user.username + 'さんの欲しい物リスト'}
                axiosUrl="http://localhost:8000/api/"
                />
            </DescriptionWrapper>
        )
    }
  }
}

export default User_Description;

const DescriptionWrapper = styled.div`
  width: 77%;
  margin-left: auto;
  margin-right: auto;
`;