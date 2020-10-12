import React, { Component } from 'react';
import styled from "styled-components";
import GitHub from "../../assets/github-logo.png";
import Qiita from "../../assets/qiita.png";
import { Colors } from "../../presentational/shared/static/CSSvariables";

class Footer extends Component {
 constructor(props){
 super(props);
}

render() {
    return (
        <Wrapper>
            <CopyRight>Copyright © "Toshiyuki Hori" all rights reserved</CopyRight>
            <a href="https://github.com/Toshiyuki023Hori">
                <Icon src={GitHub} alt="GitHubのロゴ"/>
            </a>
            <a href="https://qiita.com/Toshiyuki023Hori">
                <Icon src={Qiita} alt="Qiitaのロゴ"/>
            </a>
        </Wrapper>
    )
}
}

export default Footer

const Wrapper = styled.div`
  width:100%;
  margin-top:30px;
  padding:15px;
  background: ${Colors.accent2};
  display:flex;
  justify-content:center;
  align-items: center;

`;

const CopyRight = styled.h3`
  color:${Colors.subcolor1};
  vertical-align:middle;
  font-size:17px;
  margin-right:17px;
`;

const Icon = styled.img`
  width:36px;
  height:100%;
  margin-right:17px;
`;