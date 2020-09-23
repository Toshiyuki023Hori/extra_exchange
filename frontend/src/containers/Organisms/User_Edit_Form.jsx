import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import CircularProgresss from '@material-ui/core/CircularProgress';
import MiddleButton from '../../presentational/shared/MiddleButton';

class User_Edit_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   #インプット情報用
      info: {
        username: this.props.loginUser.username,
        email: this.props.loginUser.email,
        profile: this.props.loginUser.profile,
        icon: this.props.loginUser.icon,
        background: this.props.loginUser.background,
      },
      //   Validation用
      // 　urlは必須項目ではないのでValidationには含めない
      message: {
        username: '',
        email: '',
      },
      loginUser: this.props.loginUser,
      imgUrls: {},
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
    this.cancelUploadedImage = this.cancelUploadedImage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setNoImage = this.setNoImage.bind(this);
  }

  async componentDidMount() {
    if (this.state.info.icon != null) {
      await this.setState({ imgUrls: { ...this.state.imgUrls, icon: this.state.info.icon } });
    }
    if (this.state.info.background != null) {
      this.setState({ imgUrls: { ...this.state.imgUrls, background: this.state.info.background } });
    }
  }

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

  handleImageSelect = async (e) => {
    const name = e.target.name;
    const file = e.target.files[0];
    // Submit用のオブジェクトにアップロードされたファイルを格納
    const { info } = this.state;
    this.setState({
      info: { ...info, [name]: file },
    });
    console.log(this.state.info.icon);
    // console.log(this.state.info[name]);
    // 画像プレビュー機能用のオブジェクトにDataURLに返還された画像URLを格納
    let reader = new FileReader();
    reader.onload = () => {
      this.setState({ imgUrls: { ...this.state.imgUrls, [name]: reader.result } });
    };
    reader.readAsDataURL(file);
  };

  setNoImage = async (target) => {
    await this.setState({ info: { ...this.state.info, [target]: null } });
  };

  cancelUploadedImage = async (target) => {
    await this.setState({ info: { ...this.state.info, [target]: this.props.loginUser.icon } });
    await this.setState({ imgUrls: { ...this.state.imgUrls, [target]: null } });
  };

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Validation           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

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
    if (value.length < 5) return 'ユーザーネームは最低5文字以上入力してください。';
    return '';
  }

  emailValidation(value) {
    if (!value) return 'メールアドレスは必須項目です。';
    const regex = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regex.test(value)) return '正しい形式で入力をしてください。';
    return '';
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  //            ===========           ===========           ===========
  //                       handleSubmit 始まり
  //            ===========           ===========           ===========

  handleSubmit = async () => {
    const data = new FormData();
    const config = {
      headers: { 'content-type': 'multipart/form-data' },
    };
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    // 編集前に画像が設定されているなら、レンダー時にURLの形で入っている。
    // Submit時にstringということはhandleImageがemitされていない、
    // つまり、編集されていないということだからFormDataには入れない(エラーが出るため)
    const deleteStringUrl = (key) => {
      if (typeof this.state.info[key] == 'string') {
        this.setState({ info: { ...this.state.info, [key]: 'noChangeImage' } });
      }
    };

    // もしicon,backgroundが編集されなかったらnoChangeImageに変換
    await deleteStringUrl('icon');
    await deleteStringUrl('background');

    console.log('Change To ' + this.state.info.icon + ' ?');
    console.log('Change To ' + this.state.info.background + ' ?');

    Object.keys(this.state.info)
      // image, backgroundが変更されていない場合、それを取り除くためのfilter
      .filter((key) => this.state.info[key] !== 'noChangeImage')
      .map((filteredKey) => {
        data.append(filteredKey, this.state.info[filteredKey]);
        console.log(...data);
      });

    axios
      .patch(this.props.axiosUrl + 'user/' + this.props.loginUser.id + '/', data,authHeader)
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    // history.push('/user/edit');
  };

  //            ===========           ===========           ===========
  //                       handleSubmit 終わり
  //            ===========           ===========           ===========

  render() {
    return (
      <>
        <div>
          <div>
            <label>ユーザーネーム</label>
            <input
              name="username"
              type="text"
              value={this.state.info.username}
              onChange={this.handleChange}
            />
            <p>{this.state.message.username}</p>
          </div>

          <div>
            <label>メール</label>
            <input
              name="email"
              type="email"
              value={this.state.info.email}
              onChange={this.handleChange}
            />
            <p>{this.state.message.email}</p>
          </div>
        </div>

        <div>
          <label>プロフィール</label>　
          <textarea
            name="profile"
            value={this.state.info.profile}
            cols="30"
            rows="10"
            onChange={this.handleChange}
          ></textarea>
        </div>

        <div>
          <label>アイコン画像</label>
          <input name="icon" type="file" onChange={this.handleImageSelect} />
          {this.state.imgUrls.icon != null ? (
            <>
              <Image src={this.state.imgUrls.icon} alt="" />
              {typeof this.state.info.icon == 'string' ? (
                <button name="icon" onClick={() => this.setNoImage('icon')}>
                  アイコンを未設定にする
                </button>
              ) : (
                <button name="icon" onClick={() => this.cancelUploadedImage('icon')}>
                  画像取り消し
                </button>
              )}
            </>
          ) : (
            <Image src="" alt="" />
          )}
        </div>

        <div>
          <label>背景画像</label>
          <input name="background" type="file" onChange={this.handleImageSelect} />
          {this.state.imgUrls.background != null ? (
            <>
              <Image src={this.state.imgUrls.background} alt="" />
              {typeof this.state.info.background == 'string' ? (
                <button name="background" onClick={() => this.setNoImage('background')}>
                  背景を未設定にする
                </button>
              ) : (
                <button name="background" onClick={() => this.cancelUploadedImage('background')}>
                  画像取り消し
                </button>
              )}
            </>
          ) : (
            <Image src="" alt="" />
          )}
        </div>

        <MiddleButton
          btn_name="編集完了"
          btn_type="submit"
          btn_click={this.handleSubmit}
          btn_disable={
            !this.state.info.username ||
            !this.state.info.email ||
            this.state.message.username ||
            this.state.message.email
          }
        />
      </>
    );
  }
}

const Image = styled.img`
  width: 150px;
`;

export default User_Edit_Form;
