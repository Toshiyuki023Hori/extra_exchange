import React from 'react';
import PropTypes from 'prop-types';
import LargeButton from '../../presentational/shared/LargeButton';
import ValidationMessage from '../../presentational/shared/ValidationMessage';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Colors } from '../../presentational/shared/static/CSSvariables';
import { lighten } from 'polished';
import * as actions from '../../reducks/auth/actions';
import { mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Register_Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //   #インプット情報用
      info: {
        username: '',
        email: '',
        password: '',
        confirmPass: '',
      },
      //   Validation用
      message: {
        username: '',
        email: '',
        password: '',
        confirmPass: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           state変更に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    const { info, message } = this.state;
    this.setState({
      info: { ...info, [name]: value },
    });
    this.setState({
      message: { ...message, [name]: this.validator(name, value) },
    });
  }

  //           ===========           ===========
  //           Validation            ===========
  //           ===========           ===========

  validator(name, value) {
    switch (name) {
      case 'username':
        return this.usernameValidation(value);
      case 'email':
        return this.emailValidation(value);
      case 'password':
        return this.passwordValidation(value);
      case 'confirmPass':
        return this.confirmPassValidation(value);
    }
  }

  usernameValidation(value) {
    if (!value) return 'ユーザーネームは必須項目です。';
    if (value.length < 5) return 'ユーザーネームは最低5文字です。';
    return '';
  }

  emailValidation(value) {
    if (!value) return 'メールアドレスは必須項目です。';
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(value)) return '正しい形式で入力をしてください。';
    return '';
  }

  passwordValidation(value) {
    if (!value) return 'パスワードは必須項目です。';
    if (value.length < 8) return 'パスワードは最低8文字入力してください。';
    const regex = /^(?=.*?[a-z])(?=.*?\d)[a-z\d]{8,100}$/i;
    if (!regex.test(value)) return 'パスワードは半角英数字をそれぞれ一種類以上必要です。。';
    return '';
  }

  confirmPassValidation(value) {
    if (!value) return '確認用パスワードは必須項目です。';
    if (this.state.info.password !== value) return 'パスワードが一致しません';
    return '';
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleSubmit = () => {
    this.props.onAuth(this.state.info.username, this.state.info.email, this.state.info.password);

    // インプットを空白に戻すためのコード
    this.setState({
      info: {
        username: '',
        email: '',
        password: '',
        confirmPass: '',
      },
    });
  };

  render() {
    let errorMessageUser = null;
    let errorMessageEmail = null;
    // 登録失敗時にerror.response.dataはobjectで返ってくる
    // error.response.dataにusernameが入っていたら
    if (this.props.error) {
      errorMessageUser = <p>{this.props.error.username}</p>;
    }
    // error.response.dataにemailが入っていたら
    if (this.props.error) {
      errorMessageEmail = <p>{this.props.error.email}</p>;
    }

    const { info, message } = this.state;
    return (
      <>
        <Wrapper>
          <Tytle>会員登録</Tytle>
          <InputArea>
            <FormArea>
              <li>
                <FormLabel>ユーザーネーム</FormLabel>
                <InputForm
                  name="username"
                  type="text"
                  value={info.username}
                  onChange={this.handleChange}
                  placeholder="最低5文字以上入力してください"
                />
              </li>
              {this.props.error != null ? (
                <ValidationMessage
                  errorMessage={errorMessageUser}
                  isShowup={message.user != ''}
                  text_color="#D9F1FF"
                  margin="10px auto 0px auto"
                  bg_color="#70AACC"
                />
              ) : (
                <ValidationMessage
                  errorMessage={message.username}
                  isShowup={message.username != ''}
                  text_color="#D9F1FF"
                  margin="10px auto 0px auto"
                  bg_color="#70AACC"
                />
              )}

              <li>
                <FormLabel>メール</FormLabel>
                <InputForm
                  name="email"
                  type="email"
                  value={info.email}
                  onChange={this.handleChange}
                />
              </li>
              {this.props.error != null ? (
                <ValidationMessage
                  errorMessage={errorMessageEmail}
                  isShowup={errorMessageEmail != ''}
                  text_color="#D9F1FF"
                  margin="10px auto 0px auto"
                  bg_color="#70AACC"
                />
              ) : (
                <ValidationMessage
                  errorMessage={message.email}
                  isShowup={message.email != ''}
                  text_color="#D9F1FF"
                  margin="10px auto 0px auto"
                  bg_color="#70AACC"
                />
              )}

              <li>
                <FormLabel>パスワード</FormLabel>
                <InputForm
                  name="password"
                  type="password"
                  value={info.password}
                  onChange={this.handleChange}
                  placeholder="半角英数字最低8文字以上入力してください"
                />
              </li>
              <ValidationMessage
                errorMessage={message.password}
                isShowup={message.password != ''}
                text_color="#D9F1FF"
                margin="10px auto 0px auto"
                bg_color="#70AACC"
              />

              <li>
                <FormLabel>パスワード確認</FormLabel>
                <InputForm
                  name="confirmPass"
                  type="password"
                  value={info.confirmPass}
                  onChange={this.handleChange}
                  placeholder="半角英数字最低8文字以上入力してください"
                />
              </li>
              <ValidationMessage
                errorMessage={message.confirmPass}
                isShowup={message.confirmPass != ''}
                text_color="#D9F1FF"
                margin="10px auto 0px auto"
                bg_color="#70AACC"
              />
            </FormArea>

            <SubmitButton
              btn_name="登録"
              btn_type="submit"
              btn_click={this.handleSubmit}
              btn_disable={
                !info.username ||
                !info.email ||
                !info.password ||
                !info.confirmPass ||
                message.username ||
                message.email ||
                message.password ||
                message.confirmPass
              }
              btn_back={Colors.accent2}
              btn_text_color={Colors.subcolor1}
              btn_shadow={Colors.accent1}
            />
          </InputArea>
        </Wrapper>
      </>
    );
  }
}

Register_Form.propTypes = {
  url: PropTypes.string,
  method: PropTypes.string,
};

const mapStateToProps = (state) => {
  return {
    uid: state.uid,
    loading: state.loading,
    error: state.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (username, email, password) => dispatch(actions.authSignup(username, email, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Register_Form);

export const Wrapper = styled.div`
  ${mixinHeaderSpace};
  width: 100%;
  height:70vh;
`;

export const InputArea = styled.div`
  background-color: ${Colors.subcolor1};
  width: 70%;
  margin: 10px auto 0px auto;
  height: 480px;
  display: grid;
  grid-template-rows: 4fr 1fr;
  grid-template-columns: 1fr;
  padding: 15px;
`;

export const Tytle = styled.h1`
  text-align: center;
`;

export const FormArea = styled.ul`
  display: flex;
  flex-direction: column;
  justify-content: space-around;

  li {
    display: flex;
    list-style: none;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
  }
`;

export const InputForm = styled.input`
  background: white;
  height: 40px;
  width: 40%;
  border: 1.2px solid ${Colors.accent1};

  &::placeholder {
    color: ${Colors.characters};
    font-size: 0.82em;
  }
`;

export const FormLabel = styled.label`
  width: 120px;
  margin-right: 40px;
  float: left;
  font-weight: 700;
`;

export const SubmitButton = styled(LargeButton)`
  margin: 15px auto 0px auto;

  &:hover:enabled {
    background-color: ${lighten(0.1, '#466A80')};
    transition: all 200ms linear;
  }

  &:active:enabled {
    box-shadow: 0px 0px 0px;
    transform: translate(4px, 3px);
  }
`;
