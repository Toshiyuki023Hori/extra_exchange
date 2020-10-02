import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import Icon from './Icon';
import { Colorts } from './static/CSSvariables';

class Word_Bubble extends Component {
  constructor(props) {
    super(props);
    this.state = {
      icon: '',
    };
  }

  componentDidMount() {
    const { axiosUrl, commenter } = this.props;
    axios
      .get(this.props.axiosUrl + 'user/' + this.props.commenter)
      .then((res) => {
        this.setState({ icon: res.data.icon });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { background } = this.props;
    return (
      <div>
        <Bubble background={background}>
            <div>
              <Icon 
              src={this.state.icon} 
              alt=""
              img_radius="50%"
              img_height="50px"
              img_width="50px"
              />
            </div>
          <p>{this.props.text}</p>
        </Bubble>
      </div>
    );
  }
}

export default Word_Bubble;

const Bubble = styled.div`
  position: relative;
  padding: 20px;
  background: ${(props) => props.background};
  display: inline-block;
  border-radius: 10px;
  &::before {
    content: '';
    position: absolute;
    display: block;
    width: 0;
    height: 0;
    left: -15px;
    top: 20px;
    border-right: 15px solid ${(props) => props.background};
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
  }
`;

const Bubble__Icon = styled.div`

`;
