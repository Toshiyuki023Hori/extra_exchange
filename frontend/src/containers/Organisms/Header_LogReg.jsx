import React, { Component } from 'react';
import { connect } from 'react-redux';
import history from '../../history';
import styled from 'styled-components';
import axios from 'axios';
// 以下各ディレクトリからimport
import * as actions from '../../reducks/auth/actions';
import Logo from '../../assets/Logo.png';
import { Colors } from "../../presentational/shared/static/CSSvariables";

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
  position:fixed;
  top:0;
  left:0;
  padding: 10px 5px 5px 5px;
  width: 100%;
  height:110px;
  background-color: #8dd6ff;
  display: grid;
  grid-template-columns: 1fr 5fr;
  box-shadow: 0px 1px 5px;
`;

const Image = styled.img`
  width: 230px;
  margin-top: 5px;

  &:hover{
    box-shadow:0px 0px 7px ${Colors.accent2};
    transform:scale(1.02,1.02);
    transition-duration:0.75s;
  }
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


