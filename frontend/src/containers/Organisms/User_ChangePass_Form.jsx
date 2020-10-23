import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import MiddleButton from '../../presentational/shared/MiddleButton';
import ValidationMessage from '../../presentational/shared/ValidationMessage';
import {
  Colors,
  mixinInputForm,
  mixinLiTag,
  mixinUlLabel,
} from '../../presentational/shared/static/CSSvariables';

class User_ChangePass_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
      message: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    this.setState({ info: { ...this.state.info, [name]: value } });
    this.setState({
      message: { ...this.state.message, [name]: this.validator(name, value) },
    });
  };

  //           ===========           ===========
  //           Validation            ===========
  //           ===========           ===========

  validator(name, value) {
    switch (name) {
      case 'oldPassword':
        return this.oldPasswordValidation(value);
      case 'newPassword1':
        return this.newPasswordValidation(value);
      case 'newPassword2':
        return this.confirmPassValidation(value);
    }
  }

  oldPasswordValidation(value) {
    if (!value) return '旧パスワードは必須項目です。';
    if (value.length < 8) return 'パスワードは最低8文字入力してください。';
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i;
    if (!regex.test(value)) return 'パスワードは半角英数字をそれぞれ一種類以上含めたものです';
    return '';
  }

  newPasswordValidation(value) {
    if (!value) return '新パスワードは必須項目です。';
    if (value.length < 8) return 'パスワードは最低8文字入力してください。';
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i;
    if (!regex.test(value))
      return 'パスワードは半角英数字をそれぞれ一種類以上含める必要があります。';
    return '';
  }

  confirmPassValidation(value) {
    if (!value) return '確認用パスワードは必須項目です。';
    if (this.state.info.newPassword1 !== value) return 'パスワードが一致しません';
    return '';
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  async handleSubmit() {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    console.log(authHeader);

    axios
      .post(
        this.props.authUrl,
        {
          oldPassword: this.state.info.oldPassword,
          newPassword1: this.state.info.newPassword1,
          newPassword2: this.state.info.newPassword2,
        },
        authHeader
      )
      .then((res) => {
        if (res.status == '200') {
          window.alert('パスワードの変更に成功しました。');
        }
      })
      .catch((err) => {
        if (err.response.status != '200') {
          window.alert('変更に失敗しました。申し訳ありませんが、もう一度入力をお願いします。');
        }
      });

    this.setState({
      info: {
        oldPassword: '',
        newPassword1: '',
        newPassword2: '',
      },
    });
  }

  render() {
    const { resultMessage, info, message } = this.state;
    return (
      <div className={this.props.className}>
        <h2>パスワード変更</h2>

        <FormArea>
          <StyledLiTag>
            <label>旧パスワード</label>
            <InputForm
              onChange={this.handleChange}
              type="password"
              name="oldPassword"
              value={info.oldPassword}
            />
          </StyledLiTag>
          <ValidationMessage
            errorMessage={message.oldPassword}
            isShowup={message.oldPassword != ''}
            text_color="#D9F1FF"
            margin="10px 0px 0px 140px"
            bg_color="#70AACC"
          />

          <StyledLiTag>
            <label>新パスワード</label>
            <InputForm
              onChange={this.handleChange}
              type="password"
              name="newPassword1"
              value={info.newPassword1}
            />
          </StyledLiTag>
          <ValidationMessage
            errorMessage={message.newPassword1}
            isShowup={message.newPassword1 != ''}
            text_color="#D9F1FF"
            margin="10px 0px 0px 140px"
            bg_color="#70AACC"
          />

          <StyledLiTag>
            <label>新パスワード(確認用)</label>
            <InputForm
              onChange={this.handleChange}
              type="password"
              name="newPassword2"
              value={info.newPassword2}
            />
          </StyledLiTag>
          <ValidationMessage
            errorMessage={message.newPassword2}
            isShowup={message.newPassword2 != ''}
            text_color="#D9F1FF"
            margin="10px 0px 0px 140px"
            bg_color="#70AACC"
          />

          <StyledLiTag>
            <SubmitButton
              btn_type="submit"
              btn_click={this.handleSubmit}
              btn_disable={
                !info.oldPassword ||
                !info.newPassword1 ||
                !info.newPassword2 ||
                message.oldPassword ||
                message.newPassword1 ||
                message.newPassword2
              }
            >
              変更
            </SubmitButton>
          </StyledLiTag>
        </FormArea>
      </div>
    );
  }
}

export default User_ChangePass_Form;

const FormArea = styled.ul`
  label {
    ${mixinUlLabel};
    margin-right: 30px;
    width: 160px;
  }
`;

const StyledLiTag = styled.li`
  ${mixinLiTag};
  margin-top: 15px;
`;

const InputForm = styled.input`
  ${mixinInputForm};
`;

const SubmitButton = styled(MiddleButton)`
  display: block;
  margin: 10px auto;
  background: ${(props) => (!props.btn_disable ? '#8DD6FF' : '#E0F4FF')};
  color: ${(props) => (!props.btn_disable ? '#466A80' : '#BDCFDA')};
  box-shadow: 4px 3px ${Colors.accent1};

  &:hover:enabled {
    background-color: #a8e0ff;
    transition: all 200ms linear;
  }

  &:active:enabled {
    box-shadow: 0px 0px 0px;
    transform: translate(4px, 3px);
  }
`;
