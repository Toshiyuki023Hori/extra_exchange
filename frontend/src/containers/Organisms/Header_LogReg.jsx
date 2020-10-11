import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import styled from 'styled-components';
import axios from 'axios';
// 以下各ディレクトリからimport
import * as actions from '../../reducks/auth/actions';
import SearchBox from '../../presentational/shared/SearchBox';
import Logo from '../../assets/Logo.png';
import SmallButton from '../../presentational/shared/SmallButton';

class Header_LogReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: this.props.loginUser,
    };
    this.jumpToTop = this.jumpToTop.bind(this);
  }

  jumpToTop(){
    history.push("/top")
  }

  render() {
    const { isAuthenticated } = this.props;
    const { loginUser } = this.state;

    return (
      <>
        <Wrapper>
          <Image src={Logo} alt="" onClick={this.jumpToTop}/>
          <TextDiv>
           <Text>{this.props.loginOrRegister}</Text>
          </TextDiv>
        </Wrapper>
      </>
    );
  }
}

export default Header_LogReg;

const Wrapper = styled.div`
  background-color: #8dd6ff;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 5fr;
  padding: 10px 5px 5px 5px;
`;

const Image = styled.img`
  width: 230px;
  margin-top: 5px;
`;

const TextDiv = styled.div`
  display:flex;
  align-items:flex-end;
  position: relative;
  bottom: 5px;
  left: 15px;
`;

const Text = styled.p`
  font-size:1.25em;
  vertical-align:bottom;
`;


