import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../Organisms/Header';
import { mixinHeaderSpace } from "../../presentational/shared/static/CSSvariables";

class About extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginUser: '',
    };
  }

  componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';

    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => this.setState({ loginUser: res.data }))
      .catch((err) => console.log(err));
  }

  render() {
    let welcomeMessage;
    if (!this.props.isAuthenticated) {
      welcomeMessage = 'ご登録ありがとうございます。';
    } else {
      welcomeMessage = 'いらないもの同士交換してみませんか?';
    }
    return (
        <>
            <Header loginUser={this.state.loginUser} />
            <Body>
                <p>{welcomeMessage}</p>
                <div>
                    <h2>使い方ガイド</h2>
                    <div>
                        <h2>下準備</h2>
                        <p>いらないものを出品してみよう</p>
                        <p>欲しいものを登録しよう</p>
                        <p>取引場所を登録しよう</p>
                    </div>
                    <div>
                        <h2>取引の仕方</h2>
                        <p>取引をリクエストする</p>
                        <p>取引相手と交換する</p>
                    </div>
                </div>
            </Body>
        </>
    );
  }
}

export default About;

const Body = styled.div`
  ${mixinHeaderSpace};
`;