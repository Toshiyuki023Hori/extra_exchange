import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  mixinHeaderSpace,
  mixinHoverUnderlineEffect,
  Colors,
} from '../../presentational/shared/static/CSSvariables';
import ImageOfWantReg from '../../assets/Want_List.png';
import ImageOfGiveReg from '../../assets/Give_List.png';
import ImageOfPickupReg from '../../assets/Pickup_list.png';
import ImageOfDealStep from '../../assets/Deal_Step.png';

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
    let aboutView = (user) => {
      return (
        <>
          <Header loginUser={user} />
          <Body>
            <Message>{welcomeMessage}</Message>
            <MainDiv>
              <Title>使い方ガイド</Title>
              <SubTitle>下準備</SubTitle>
              <PrepareDiv>
                <PrepareStepDiv>
                  <img src={ImageOfGiveReg} alt="商品出品の手順画像" />
                  <LinkText href="/give/add">商品を出品する</LinkText>
                </PrepareStepDiv>

                <PrepareStepDiv>
                  <img src={ImageOfWantReg} alt="欲しいものリストの登録の手順画像" />
                  <LinkText href="/want/add">欲しいものリストを登録する</LinkText>
                </PrepareStepDiv>

                <PrepareStepDiv>
                  <img src={ImageOfPickupReg} alt="ピックアップ地点登録の手順画像" />
                  <LinkText href="/user/pickup">ピックアップ場所を登録する</LinkText>
                </PrepareStepDiv>
              </PrepareDiv>
              <SubTitle>取引の仕方</SubTitle>
              <DealStepDiv>
                <img src={ImageOfDealStep} alt="取引の流れの手順画像" />
              </DealStepDiv>
            </MainDiv>
          </Body>
          <Footer />
        </>
      );
    };

    if (!this.props.isAuthenticated) {
      welcomeMessage = 'いらないもの同士交換してみませんか?';
    } else {
      welcomeMessage = 'ご登録ありがとうございます。';
    }

    if (!this.props.isAuthenticated) {
      return aboutView('');
    } else {
      if (this.state.loginUser == '') {
        return <CircularProgress />;
      } else {
        return aboutView(this.state.loginUser);
      }
    }
  }
}

export default About;

const Body = styled.div`
  ${mixinHeaderSpace};
  width: 70%;
  margin: 130px auto 0px auto;
`;

const MainDiv = styled.div`
  margin-top: 10px;
`;

const Message = styled.h2`
  text-align: center;
`;

const Title = styled.p`
  margin: 0px auto 15px auto;
  width: 200px;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  border-bottom: 4px solid ${Colors.main};
`;

const SubTitle = styled.p`
  margin-top: 18px;
  font-size: 1.3rem;
  text-align: center;
  width: 125px;
  border-radius: 6px;
  padding: 5px 10px;
`;

const PrepareDiv = styled.div`
  display: flex;
  justify-content: space-around;
`;

const PrepareStepDiv = styled.div`
  width: 220px;
  display: grid;
  grid-row-gap: 10px;
  justify-content: center;

  img {
    height: 260px;
    display: block;
  }
`;

const LinkText = styled.a`
  text-align: center;
  color: ${Colors.accent2};
  text-decoration: none;
  display: inline-block;
  position: relative;

  &:hover {
    font-weight: 700;
  }
`;

const DealStepDiv = styled.div`
  img {
    height: 350px;
    margin: 0px auto;
    display: block;
  }
`;
