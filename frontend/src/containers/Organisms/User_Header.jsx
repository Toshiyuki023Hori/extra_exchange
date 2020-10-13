import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import defaultBG from "../../assets/default_bg.jpg";
import Icon from "../../presentational/shared/Icon";
import Background from '../../presentational/shared/Background';

class User_Header extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const {user} = this.props;
    return(
        <div>
            <Background 
            background={user.background}
            bg_width="100%"
            bg_height="70px"
            />
            <StyledIcon 
            icon={user.icon}
            img_width="100px"
            img_height="100px"
            img_radius="50px"
            />
            <Username>{user.username}</Username>
        </div>
    )
  }
}

export default User_Header;


const StyledIcon = styled(Icon)`
  display: block;
  margin-left: auto;
  margin-right: auto;
`;

const Username = styled.h2`
  text-align:center;
`;