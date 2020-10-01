import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

class Chat_Place extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allComments: '',
      comment: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  setComments = () => {
    axios
      .get(this.props.axiosUrl + 'comment/?item=' + this.props.giveItem)
      .then((res) => {
        if (res.data.length > 0) {
          this.setState({ allComments: res.data });
        } else {
          this.setState({ allComments: 'まだ投稿がありません' });
        }
      })
      .catch((err) => console.log(err));
  };

  // クエリにGiveItem.idを入れるためにDidUpdate使用
  componentDidUpdate(prevProps) {
    if (prevProps.giveItem != this.props.giveItem) this.setComments();
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ [name]: value });
  };

  handleSubmit = async () => {
    const { giveItem, loginUser, axiosUrl } = this.props;
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    await axios
      .post(
        axiosUrl + 'comment/',
        {
          comment: this.state.comment,
          owner: loginUser.id,
          item: giveItem,
        },
        authHeader
      )
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));

    this.setComments();
    this.setState({ comment: '' });
  };

  render() {
    const { allComments, comment } = this.state;
    let commentsView;
    console.log(allComments);
    if (allComments === 'まだ投稿がありません') {
      commentsView = <p>{allComments}</p>;
    } else if (allComments.length > 0) {
      commentsView = allComments.map((commentObj) => {
        return <p key={commentObj.id}>{commentObj.comment}</p>;
      });
    }

    if (this.state.allComments == '') {
      return <CircularProgress />;
    } else {
      return (
        <CommentWrapper>
          <h3>コメント</h3>
          {commentsView}
          <input
            value={comment}
            type="text"
            name="comment"
            onChange={this.handleChange}
            placeholder="コメントを入力してください"
          />
          <button type="submit" onClick={this.handleSubmit}>
            送信
          </button>
        </CommentWrapper>
      );
    }
  }
}

export default Chat_Place;

const CommentWrapper = styled.div`
  width: 77%;
  margin-left: auto;
  margin-right: auto;
`;
