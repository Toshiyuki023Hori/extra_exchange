import React, { Component } from 'react';
import styled, { css } from 'styled-components';
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
    this.deleteComment = this.deleteComment.bind(this);
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
      .catch((err) => window.alert('未記入で送信はできません。'));

    this.setComments();
    this.setState({ comment: '' });
  };

  deleteComment = async (comment_id, comment_owner) => {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const result = window.confirm('このコメントを削除してよろしいですか?');

    if (result && comment_owner == this.props.loginUser.id) {
      await axios.delete(this.props.axiosUrl + 'comment/' + comment_id, authHeader);
      this.setComments();
    } else {
      window.alert('コメントは、コメントを投稿したユーザー自身でしか削除できません。');
    }
  };

  render() {
    const { loginUser } = this.props;
    const { allComments, comment } = this.state;
    let commentsView;
    //
    if (allComments === 'まだ投稿がありません') {
      commentsView = <NotHavePtag>{allComments}</NotHavePtag>;
    } else if (allComments.length > 0) {
      commentsView = allComments.map((commentObj) => {
        return (
          <Word_Bubble
            axiosUrl="http://localhost:8000/api/"
            key={commentObj.id}
            text={commentObj.comment}
            commenter={commentObj.owner}
            isHost={commentObj.owner == this.props.owner}
            onClick={() => this.deleteComment(commentObj.id, commentObj.owner)}
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
          <CommentDiv>{commentsView}</CommentDiv>
          <SubmitDiv>
            <textarea
              value={comment}
              name="comment"
              onChange={this.handleChange}
              placeholder={
                this.props.loginUser === 'なし'
                  ? 'コメント機能は登録ユーザーのみがご利用になれます'
                  : 'コメントを入力してください'
              }
              disabled={this.props.loginUser === 'なし'}
            />
            <button type="submit" onClick={this.handleSubmit}>
              送信
            </button>
          </SubmitDiv>
        </div>
      );
    }
  }
}

export default Comment_Zone;

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

    &:disabled {
      background: #cecece;
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

const NotHavePtag = styled.p`
  margin-bottom: 1rem;
`;
