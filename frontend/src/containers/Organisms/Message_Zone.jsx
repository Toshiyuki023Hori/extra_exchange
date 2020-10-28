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
    this.deleteMessage = this.deleteMessage.bind(this);
  }

  // Dealが持つMessageを全て取得し、stateにセットするfunction
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
  }; // setMessages closing

  componentDidMount() {
    this.setMessages();
  } // componentDidMount closing

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  }; // handleChangeClosing

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
      .catch((err) => window.alert('未記入で送信はできません。'));

    // submit後に画面にも反映させたいので、stateを更新
    this.setMessages();
    this.setState({ message: '' });
  }; // handleSubmit closing

  deleteMessage = async (message_id, messageOwner) => {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const result = window.confirm('このメッセージを削除してもよろしいですか?');

    if (result && this.props.loginUser.id == messageOwner) {
      await axios
        .delete(this.props.axiosUrl + 'private/' + message_id, authHeader)
        .then((res) => console.log(res.data))
        .catch((err) => window.alert('コメントの削除に失敗しました'));
      this.setMessages();
    } else {
      window.alert('メッセージは、メッセージを投稿したユーザー自身でしか削除できません。');
    }
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
            isHost={messageObj.owner == this.props.hostUser}
            onClick={() => this.deleteMessage(messageObj.id, messageObj.owner)}
          />
        );
      });
    }

    if (this.state.allMessages == '') {
      return null;
    } else {
      return (
        <Wrapper>
          <h3>メッセージ</h3>
          <CommentDiv>{messagesView}</CommentDiv>
          <SubmitDiv>
            <textarea
              value={message}
              name="message"
              onChange={this.handleChange}
              placeholder="取引当日までの打ち合わせをしましょう"
            />
            <button type="submit" onClick={this.handleSubmit}>
              送信
            </button>
          </SubmitDiv>
        </Wrapper>
      );
    }
  }
}

export default Message_Zone;

const Wrapper = styled.div`
  border-top: 3px solid ${Colors.accent1};
  padding-top: 1rem;
`;

const CommentDiv = styled.div`
  margin-top: 1rem;
`;

const SubmitDiv = styled.div`
  display: flex;
  justify-content: center;

  textarea {
    display: block;
    height: 3rem;
    width: 80%;
    border: 1px solid ${Colors.characters};
    resize: none;
    outline: none;

    &::placeholder {
      color: ${Colors.characters};
      vertical-align: center;
      position: relative;
      top: 0.75rem;
    }
  }

  button {
    display: block;
    width: 10%;
    height: 3rem;
    color: ${Colors.subcolor1};
    border-top: 1px solid ${Colors.accent2};
    border-right: 1px solid ${Colors.accent2};
    border-bottom: 1px solid ${Colors.accent2};
    background: ${Colors.accent1};
    outline: none;
  }
`;
