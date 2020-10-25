import React, { Component } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import Icon from './Icon';
import { Colors } from './static/CSSvariables';

class Word_Bubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      icon: '',
    };
  }

  componentDidMount() {
    const { axiosUrl, commenter } = this.props;
    axios
      .get(axiosUrl + 'user/' + commenter)
      .then((res) => {
        console.log('Icon is ' + res.data);
        this.setState({ username: res.data.username });
        this.setState({ icon: res.data.icon });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { background } = this.props;
    if (this.state.icon == '' || this.state.username == '') {
      return null;
    } else {
      return (
        <div>
          <Username>
            {this.state.username}
            {this.props.isHost && 
              <span>(ホスト)</span>
            }
          </Username>
          <Bubble isHost={this.props.isHost} onClick={this.props.onClick}>
            <Bubble__Icon>
              <Icon
                icon={this.state.icon}
                alt=""
                img_radius="50%"
                img_height="42px"
                img_width="42px"
              />
            </Bubble__Icon>
            <CommentText>{this.props.text}</CommentText>
          </Bubble>
        </div>
      );
    }
  }
}

export default Word_Bubble;

const Username = styled.p`
  position: relative;
  left: 5.3rem;
  font-size: 0.85rem;
  font-weight: bolder;
`;

const Bubble = styled.div`
  position: relative;
  padding: 8px 35px;
  display: inline-block;
  border-radius: 0.2rem;
  margin-left: 80px;
  margin-bottom: 17px;
  cursor:pointer;
  background: ${Colors.subcolor1};
  color: black;
  ${(props) =>
    props.isHost &&
    `
    background : ${Colors.accent2};
    color: ${Colors.subcolor1};
  `}

  &::before {
    content: '';
    position: absolute;
    display: block;
    width: 0px;
    height: 0px;
    left: -15px;
    top: 10px;
    border-top: 0px solid transparent;
    border-bottom: 12px solid transparent;
    border-right: 15px solid ${Colors.subcolor1};
    ${(props) =>
      props.isHost &&
      `
      border-right: 15px solid ${Colors.accent2};
    `}
  }
`;

const Bubble__Icon = styled.div`
  position: absolute;
  left: -80px;
  top: -10px;
`;

const CommentText = styled.p`
  white-space: pre-wrap;
`;
