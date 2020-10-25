import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Word_Bubble from '../../presentational/shared/Word_Bubble';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class Comment_Zone extends Component {
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

  // 初回レンダー時はprops.giveItemはempty
  // giveItemDetailでgiveItemがupdate => setCommentsでgiveItemのコメント全件取得
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
      .catch((err) => window.alert(err.response.data));

    this.setComments();
    this.setState({ comment: '' });
  };

  render() {
    const { loginUser } = this.props;
    const { allComments, comment } = this.state;
    let commentsView;
    //
    if (allComments === 'まだ投稿がありません') {
      commentsView = <p>{allComments}</p>;
    } else if (allComments.length > 0) {
      commentsView = allComments.map((commentObj) => {
        return (
          <Word_Bubble
            axiosUrl="http://localhost:8000/api/"
            key={commentObj.id}
            text={commentObj.comment}
            commenter={commentObj.owner}
            isHost={
              commentObj.owner == this.props.owner
            }
          />
        );
      });
    }

    if (this.state.allComments == '') {
      return null;
    } else {
      return (
        <div>
          <h3>コメント</h3>
          <CommentDiv>
            {commentsView}
          </CommentDiv>
          <input
            value={comment}
            type="text"
            name="comment"
            onChange={this.handleChange}
            placeholder="コメントを入力してください"
            disabled={this.props.loginUser === 'なし'}
          />
          <button type="submit" onClick={this.handleSubmit}>
            送信
          </button>
        </div>
      );
    }
  }
}

export default Comment_Zone;

const CommentDiv = styled.div`
  margin-top:1rem;
`;