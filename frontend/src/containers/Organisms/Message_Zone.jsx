import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Word_Bubble from '../../presentational/shared/Word_Bubble';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class Message_Zone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allMessages: '',
      message: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setMessages = () => {
    const { axiosUrl, deal_id } = this.props;
    axios
      .get(axiosUrl + 'private/?deal=' + deal_id)
      .then((res) => {
        if (res.data.length > 0) {
          this.setState({ allMessages: res.data });
        } else {
          this.setState({ allMessages: 'メッセージはありません' });
        }
      })
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.setMessages();
  }
  

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { deal_id, loginUser, axiosUrl } = this.props;
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    await axios
      .post(
        axiosUrl + 'private/',
        {
          message: this.state.message,
          owner: loginUser.id,
          deal: deal_id,
        },
        authHeader
      )
      .then((res) => console.log(res.data))
      .catch((err) => window.alert(err.response.data));

    this.setMessages();
    this.setState({ message: '' });
  };

  render() {
    const { allMessages, message } = this.state;
    let messagesView;
    //
    if (allMessages === 'メッセージはありません') {
      messagesView = <p>{allMessages}</p>;
    } else if (allMessages.length > 0) {
      messagesView = allMessages.map((messageObj) => {
        return (
          <Word_Bubble
            axiosUrl="http://localhost:8000/api/"
            key={messageObj.id}
            background={Colors.accent2}
            text={messageObj.message}
            commenter={messageObj.owner}
          />
        );
      });
    }

    if (this.state.allMessages == '') {
      return null;
    } else {
      return (
        <CommentWrapper>
          <h3>メッセージ</h3>
          {messagesView}
          <input
            value={message}
            type="text"
            name="message"
            onChange={this.handleChange}
            placeholder="メッセージを入力してください"
          />
          <button type="submit" onClick={this.handleSubmit}>
            送信
          </button>
        </CommentWrapper>
      );
    }
  }
}

export default Message_Zone;

const CommentWrapper = styled.div`
  width: 77%;
  margin-left: auto;
  margin-right: auto;
`;
