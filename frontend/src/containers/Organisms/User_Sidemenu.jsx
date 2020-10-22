import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class User_Sidemenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Wrapper>
        <Menu>
          <li>
            <LinkText href={'/user/' + this.props.user_id}>ユーザー情報</LinkText>
          </li>
          {this.props.isUser && (
            <li>
              <li>
                <LinkText href="/user/edit">アカウント情報の編集</LinkText>
              </li>
              <li>
                <LinkText href="/want/add">欲しいものリストの表示、追加</LinkText>
              </li>
              <li>
                <LinkText href="/give/add">商品の出品</LinkText>
              </li>
              <li>
                <LinkText href="/user/pickup">ピックアップリストの表示、追加</LinkText>
              </li>
            </li>
          )}
        </Menu>
      </Wrapper>
    );
  }
}

export default User_Sidemenu;

const Wrapper = styled.div`
  width: 300px;
  padding-left: 25px;
  padding-top: 25px;
  border-right: solid 0.8px ${Colors.accent1};
  z-index: 29;
  background: white;
`;

const Menu = styled.ul`
  li {
    margin-bottom: 1.2rem;
    color: ${Colors.characters};
    font-size: 1.05rem;
    font-weight: 400;
    list-style: none;
  }
`;

const LinkText = styled.a`
  text-decoration: none;
  color: inherit;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0px;
    width: 100%;
    height: 2px;
    background: ${Colors.characters};
    transform: scale(0, 1);
    transform-origin: left top;
    transition: transform 0.3s;
  }

  &:hover {
    font-weight: 700;
  }
  &:hover::after {
    transform: scale(1, 1);
  }
`;
