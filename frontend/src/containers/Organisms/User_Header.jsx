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
        <Wrapper>
            <Background 
            background={user.background}
            bg_width="100%"
            bg_height="208px"
            />
            <InformationDiv>
              <StyledIcon 
              icon={user.icon}
              img_width="120px"
              img_height="120px"
              img_radius="50%"
              />
              <Username>{user.username}</Username>
            </InformationDiv>
        </Wrapper>
    )
  }
}

export default User_Header;


const Wrapper = styled.div`
  height: 310px;
  `;

const InformationDiv = styled.div`
  position:relative;
  bottom: 65px;
`;

const StyledIcon = styled(Icon)`
  display: block;
  margin-left: auto;
  margin-right: auto;
  z-index:3;
`;

const Username = styled.h2`
  text-align:center;
  margin-top: 15px;
  font-size: 2.3rem;
`;


