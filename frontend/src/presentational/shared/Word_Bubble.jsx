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
      .get(axiosUrl + 'user/' + commenter)
      .then((res) => {
        console.log('Icon is ' + res.data);
        this.setState({ icon: res.data.icon });
      })
      .catch((err) => console.log(err));
  }

  render() {
    const { background } = this.props;
    if (this.state.icon == '') {
      return null;
    } else {
      return (
        <div>
          <Bubble background={background}>
            <Bubble__Icon>
              <Icon
                icon={this.state.icon}
                alt=""
                img_radius="50%"
                img_height="42px"
                img_width="42px"
              />
            </Bubble__Icon>
            <p>{this.props.text}</p>
          </Bubble>
        </div>
      );
    }
  }
}

export default Word_Bubble;

const Bubble = styled.div`
  position: relative;
  padding: 8px 35px;
  background: #466A80;
  display: inline-block;
  border-radius: 13px;
  margin-left: 80px;
  margin-bottom: 12px;
  &::before {
    content: '';
    position: absolute;
    display: block;
    width: 0px;
    height: 0px;
    left: -15px;
    top: 10px;
    border-right: 15px solid #466A80;
    border-top: 0px solid transparent;
    border-bottom: 20px solid transparent;
  }
`;

const Bubble__Icon = styled.div`
  position: absolute;
  left: -80px;
  top: -10px;
`;
