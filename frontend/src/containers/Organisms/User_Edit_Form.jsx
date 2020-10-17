import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import MiddleButton from '../../presentational/shared/MiddleButton';
import ValidationMessage from '../../presentational/shared/ValidationMessage';
import { mixinHeaderSpace, Colors } from '../../presentational/shared/static/CSSvariables';
import Preview_Place from '../../assets/Preview_Place.png';

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
    const spreadAssign = (spreadKey, name, value) => {
      this.setState({ [spreadKey]: { ...this.state[spreadKey], [name]: value } });
    };

    if (this.state.info.icon != null) {
      await spreadAssign('imgUrls', 'icon', this.state.info.icon);
    }
    if (this.state.info.background != null) {
      spreadAssign('imgUrls', 'background', this.state.info.background);
    }
    if (this.state.info.profile == 'null') {
      spreadAssign('info', 'profile', ' ');
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
    const { info } = this.state;
    // Submit用のinfoオブジェクトにアップロードされたファイルを格納
    this.setState({
      info: { ...info, [name]: file },
    });
    console.log(this.state.info.icon);
    // console.log(this.state.info[name]);
    // 画像プレビュー機能用のimgUrlsオブジェクトにDataURLに返還された画像URLを格納
    let reader = new FileReader();
    reader.onload = () => {
      this.setState({ imgUrls: { ...this.state.imgUrls, [name]: reader.result } });
    };
    reader.readAsDataURL(file);
  };

  setNoImage = (target) => {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    let result = window.confirm('本当にこの画像を削除し、未設定に変更しますか?');
    if (result) {
      axios
        .delete(
          this.props.axiosUrl + 'user/' + this.props.loginUser.id + '/delete-' + target + '/',
          authHeader
        )
        // 画像削除はaxios.deleteで完了。Submitされたくないので、handleSubmitでfilterされるように加工。
        .then(async (res) => {
          await this.setState({ info: { ...this.state.info, [target]: 'notNeedSubmit' } });
          await this.setState({ imgUrls: { ...this.state.imgUrls, [target]: null } });
          history.push('/user/edit');
        })
        .catch((err) => window.alert(err.response.data));
    }
  };

  cancelUploadedImage = async (clickedImage) => {
    await this.setState({
      info: { ...this.state.info, [clickedImage]: this.props.loginUser[clickedImage] },
    });
    await this.setState({ imgUrls: { ...this.state.imgUrls, [clickedImage]: null } });
  };

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
        this.setState({ info: { ...this.state.info, [key]: 'notNeedSubmit' } });
      }
    };

    // もしicon,backgroundが編集されなかったらnotNeedSubmitに変換
    await deleteStringUrl('icon');
    await deleteStringUrl('background');

    Object.keys(this.state.info)
      // image, backgroundが変更されていない場合、それを取り除くためのfilter
      .filter((key) => this.state.info[key] !== 'notNeedSubmit')
      // imageが未設定、もしくは削除されたらnullになるため、それを取り除くfilter
      .filter((key) => this.state.info[key] !== null)
      .map((selectedKey) => {
        data.append(selectedKey, this.state.info[selectedKey]);
        console.log(...data);
      });

    axios
      .patch(this.props.axiosUrl + 'user/' + this.props.loginUser.id + '/', data, authHeader)
      .then((res) => history.push('/user/' + this.props.loginUser.id))
      .catch((err) => {
        console.log(err.response.data);
        if (err.response.data.username) {
          this.setState({
            message: { ...this.state.message, username: err.response.data.username },
          });
        }
        if (err.response.data.email) {
          this.setState({ message: { ...this.state.message, email: err.response.data.email } });
        }
      });
  };

  //            ===========           ===========           ===========
  //                       handleSubmit 終わり
  //            ===========           ===========           ===========

  render() {
    const { info, message, imgUrls } = this.state;
    const setNoImageButton = (name, text) => {
      return (
        <StyledButton name={name} onClick={() => this.setNoImage(name)}>
          {text}
        </StyledButton>
      );
    };

    const setCancelUploadButton = (name, text) => {
      return (
        <StyledButton name={name} onClick={() => this.cancelUploadedImage(name)}>
          {text}
        </StyledButton>
      );
    };

    let deleteIconButton;
    let deleteBackgroundButton;
    if (typeof info.icon == 'string') {
      deleteIconButton = setNoImageButton('icon', 'アイコンを未設定にする');
    } else {
      deleteIconButton = setCancelUploadButton('icon', '画像取り消し');
    }

    if (typeof info.background == 'string') {
      deleteBackgroundButton = setNoImageButton('background', '背景を未設定にする');
    } else {
      deleteBackgroundButton = setCancelUploadButton('background', '画像取り消し');
    }

    return (
      <>
        <FormArea>
          <TextLiTag>
            <label>ユーザーネーム</label>
            <InputForm
              name="username"
              type="text"
              value={info.username}
              onChange={this.handleChange}
              placeholder="最低5文字以上入力してください"
            />
          </TextLiTag>
          <ValidationMessage
            errorMessage={message.username}
            isShowup={message.username != ''}
            text_color="#FF737A"
            margin="10px 0px 0px 155px"
            bg_color="#FFBFC2"
          />

          <TextLiTag>
            <label>メール</label>
            <InputForm name="email" type="email" value={info.email} onChange={this.handleChange} />
          </TextLiTag>
          <ValidationMessage
            errorMessage={message.email}
            isShowup={message.email != ''}
            text_color="#FF737A"
            margin="10px 0px 0px 155px"
            bg_color="#FFBFC2"
          />

          <TextLiTag>
            <ProfileLabel>プロフィール</ProfileLabel>　
            <StyledTextArea
              name="profile"
              value={info.profile}
              onChange={this.handleChange}
              placeholder="最大800字"
            ></StyledTextArea>
          </TextLiTag>

          <ImageLiTag>
            <label>アイコン画像</label>
            <input name="icon" type="file" onChange={this.handleImageSelect} />
            {imgUrls.icon != null ? (
              <>
                <PreviewDiv>
                  <Image src={imgUrls.icon} alt="" />
                  {deleteIconButton}
                </PreviewDiv>
              </>
            ) : (
              <PreviewDiv>
                <Image src={Preview_Place} alt="画像表示場所" />
              </PreviewDiv>
            )}
          </ImageLiTag>

          <ImageLiTag>
            <label>背景画像</label>
            <input name="background" type="file" onChange={this.handleImageSelect} />
            {imgUrls.background != null ? (
              <>
                <PreviewDiv>
                  <Image src={imgUrls.background} alt="" />
                  {deleteBackgroundButton}
                </PreviewDiv>
              </>
            ) : (
              <PreviewDiv>
                <Image src={Preview_Place} alt="画像表示場所" />
              </PreviewDiv>
            )}
          </ImageLiTag>
          <TextLiTag>
            <StyledMiddleButton
              btn_name="編集完了"
              btn_type="submit"
              btn_click={this.handleSubmit}
              btn_disable={!info.username || !info.email || message.username || message.email}
              btn_back={Colors.main}
              btn_text_color={Colors.accent2}
              btn_shadow={Colors.accent1}
            />
          </TextLiTag>
        </FormArea>
      </>
    );
  }
}

export default User_Edit_Form;

const Image = styled.img`
  width: 150px;
`;

const FormArea = styled.ul`
  label {
    margin-right: 30px;
    width: 125px;
    float: left;
    font-weight: 700;
  }
`;

const TextLiTag = styled.li`
  list-style: none;
  display: flex;
  align-items: center;
  margin-top: 15px;
`;

const ProfileLabel = styled.label`
  position: relative;
  bottom: 90px;
`;

const InputForm = styled.input`
  background: white;
  height: 40px;
  width: 50%;
  border: 1.2px solid ${Colors.accent1};

  &::placeholder {
    color: ${Colors.characters};
    font-size: 0.82rem;
  }
`;

const StyledTextArea = styled.textarea`
  background: white;
  width: 50%;
  height: 200px;
  border: 1.2px solid ${Colors.accent1};
  position: relative;
  right: 15px;
  white-space: pre-wrap;

  &::placeholder {
    color: ${Colors.characters};
  }
`;

const ImageLiTag = styled.li`
  display: grid;
  grid-template-columns: 157px 1fr;
  margin-top: 15px;
  grid-row-gap: 10px;
`;

const PreviewDiv = styled.div`
  text-align: center;
`;

const StyledButton = styled.button`
  font-size: 0.76rem;
  padding: 5px 10px;
  background: white;
  border-radius: 5%;
  color: #6c7880;
  border: 1px solid #6c7880;
  margin-top: 10px;

  &:hover {
    color: white;
    background: #6c7880;
  }
`;

const StyledMiddleButton = styled(MiddleButton)`
  display: block;
  margin: 10px auto;
`;
