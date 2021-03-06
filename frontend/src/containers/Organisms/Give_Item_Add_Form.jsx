import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import history from '../../history';
import styled from 'styled-components';
import MiddleButton from '../../presentational/shared/MiddleButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import ValidationMessage from '../../presentational/shared/ValidationMessage';
import {
  mixinUlLabel,
  mixinInputForm,
  mixinLiTag,
  mixinDropDown,
  mixinTextArea,
  Colors,
} from '../../presentational/shared/static/CSSvariables';
import Preview_Place from '../../assets/Preview_Place_Large.png';

class Give_Item_Add_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   #インプット情報用
      info: {
        name: '',
        owner: this.props.owner.id,
        keyword1: '',
        keyword2: '',
        keyword3: '',
        bland: '',
        state: '新品',
        category: '',
        images: [],
        detail: '',
      },
      //   Validation用
      message: {
        name: '',
        keyword1: '',
        keyword2: '',
        keyword3: '',
        state: '',
        category: '',
        images: '',
        detail: '',
      },
      allCategory: null,
      allBland: null,
      imgUrls: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelUploadedImage = this.cancelUploadedImage.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           LifeCycleメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  componentDidMount() {
    // ドロップダウン式フォームのためにレンダー時にDB内のカテゴリとブランドを全て表示
    axios.get(this.props.axiosUrl + 'bland/').then(async (res) => {
      await this.setState({ ...this.state, allBland: res.data });
      console.log('Assignment ' + this.state.allBland);
    });

    axios.get(this.props.axiosUrl + 'category/').then((res) => {
      this.setState({ ...this.state, allCategory: res.data });
      console.log('Assignment ' + this.state.Category);
    });
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           state変更に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    const { info, message } = this.state;
    this.setState({
      info: { ...info, [name]: value },
    });
    this.setState({
      message: { ...message, [name]: this.validator(name, value) },
    });
  };

  // アップロードされた画像を投稿前にプレビューする機能
  // 機能するのはstateないが更新されてからであるため、
  // handleImageSelectで呼び出されるためのもの。
  readImageUrl = () => {
    const files = Array.from(this.state.info.images);
    Promise.all(
      files.map((file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            // この時、送信されてthis.state.info.imagesの中にある
            // 各imageがevent.target.resultとなる
            resolve(event.target.result);
          });
          reader.addEventListener('error', reject);
          reader.readAsDataURL(file);
        });
      })
    )
      .then((images) => {
        this.setState({ imgUrls: images });
      })
      .catch((err) => console.log(err));
  };

  handleImageSelect = async (e) => {
    await this.setState({
      info: { ...this.state.info, images: [...this.state.info.images, ...e.target.files] },
    });
    this.setState({
      message: { ...this.state.message, images: this.validator('images', this.state.info.images) },
    });
    // 画像データのURLをthis.state.imgUrlsへ送る。
    this.readImageUrl();
  };

  // 選択された画像を全て削除するためのボタン用
  cancelUploadedImage = () => {
    this.setState({ info: { ...this.state.info, images: [] } });
    this.setState({ imgUrls: [] });
  };

  //           ===========           ===========
  //           Validation            ===========
  //           ===========           ===========

  validator(name, value) {
    switch (name) {
      case 'name':
        return this.nameValidation(value);
      case 'keyword1':
        return this.keywordValidation(value);
      case 'keyword2':
        return this.keywordValidation(value);
      case 'keyword3':
        return this.keywordValidation(value);
      case 'category':
        return this.categoryValidation(value);
      case 'images':
        return this.imageValidation(value);
    }
  }

  nameValidation(value) {
    if (!value) return '商品名は必須項目です';
    if (value.length < 5) return '商品名は必ず5文字以上入力してください';
    return '';
  }

  keywordValidation(value) {
    if (!this.state.info.keyword1 && !this.state.info.keyword2 && !this.state.info.keyword3)
      return 'キーワードは最低1つ設定してください。';
    return '';
  }

  categoryValidation(value) {
    if (value === '') {
      return 'カテゴリーは必須項目です。';
    }
    return '';
  }

  imageValidation(value) {
    console.log('value is ' + value);
    if (value.length > 5) {
      return '設定できる画像は5枚までです。';
    }
    return '';
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleSubmit = async (e) => {
    e.preventDefault();
    const { axiosUrl } = this.props;

    // モデル作成順序
    // Bland, Category, Keyword => Parent_Item => Give_Item => Item_Image

    const bland_id = this.state.info.bland;
    const category_id = this.state.info.category;
    let parentItem_id;
    let giveItem_id;
    let keyword_ids = [];
    let keywordsList = [];
    let newKeywords = [];
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    // keywordがinputに入力されているかを確認するためのfunction
    const hasValueInKeyword = (keyword) => {
      if (keyword !== '') {
        keywordsList = [...keywordsList, keyword];
      } else {
      }
    };

    hasValueInKeyword(this.state.info.keyword1);
    hasValueInKeyword(this.state.info.keyword2);
    hasValueInKeyword(this.state.info.keyword3);

    // 新規keywordと既存keywordの区別
    await Promise.all(
      keywordsList.map(async (keyword) => {
        await axios
          .get(axiosUrl + 'keyword/?name=' + keyword)
          .then((res) => {
            console.log(res);
            // すでにDB内に存在していたらarrayに代入されて返ってくる
            // 新規のKeywordなら、DBに存在していないためempty array が返ってくる
            if (res.data.length !== 0) {
              keyword_ids = [...keyword_ids, res.data[0].id];
            } else {
              newKeywords = [...newKeywords, keyword];
            }
            console.log('keyword_id is ' + keyword_ids);
            console.log('New words are' + newKeywords);
          })
          .catch((err) => console.log(err));
      })
    );

    // 新規keywordの作成 => keyword_idsと再び合体
    if (newKeywords.length !== 0) {
      await Promise.all(
        newKeywords.map(async (keyword) => {
          await axios
            .post(
              axiosUrl + 'keyword/',
              {
                name: keyword,
              },
              authHeader
            )
            .then((res) => {
              keyword_ids = [...keyword_ids, res.data.id];
              console.log(keyword_ids);
            })
            .catch((err) => console.log(err));
        })
      );
    }

    await axios
      .post(
        axiosUrl + 'parent/',
        {
          name: this.state.info.name,
          owner: this.state.info.owner,
          bland: bland_id,
          keyword: keyword_ids,
        },
        authHeader
      )
      .then((res) => {
        parentItem_id = res.data.id;
        console.log('Parent is ' + parentItem_id);
      })
      .catch((err) => {
        window.alert(err.response.data);
      });

    await axios
      .post(
        axiosUrl + 'giveitem/',
        {
          state: this.state.info.state,
          category: category_id,
          detail: this.state.info.detail,
          parentItem: parentItem_id,
        },
        authHeader
      )
      .then((res) => {
        giveItem_id = res.data.id;
        console.log('giveItem is ' + giveItem_id);
      })
      .catch((err) => {
        window.alert(err.response.data);
      });

    this.state.info.images.map(async (image) => {
      let data = new FormData();
      await data.append('image', image);
      await data.append('item', giveItem_id);
      console.log(data);

      axios
        .post(axiosUrl + 'image/', data, authHeader)
        .then((res) => console.log('You made it ! \n \n' + res.data))
        .catch((err) => window.alert(err.response.data));
    });

    history.push('/top');
  };

  render() {
    const { info, message, allCategory, allBland, imgUrls } = this.state;
    let mapImages;
    let deleteUploadedButton;
    let previewPlace;
    if (imgUrls.length === 0) {
      mapImages = null;
      previewPlace = (
        <Preview_Place_Image src={Preview_Place} alc="プレビュー場所表示"></Preview_Place_Image>
      );
    } else {
      mapImages = imgUrls.map((img, idx) => {
        return <Preview_Image key={idx} src={img} alc="アップロード写真"></Preview_Image>;
      });
      deleteUploadedButton = (
        <DeleteButton onClick={this.cancelUploadedImage} imgUrls_length={imgUrls.length}>
          画像取り消し
        </DeleteButton>
      );
    }

    let keywordError;

    if (message.keyword1 != '') {
      keywordError = message.keyword1;
    } else if (message.keyword2 != '') {
      keywordError = message.keyword2;
    } else if (message.keyword3 != '') {
      keywordError = message.keyword3;
    }

    // setStateが完了するまではnullにする。
    if (this.state.allCategory === null || this.state.allBland === null) {
      return <CircularProgress />;
    } else {
      return (
        <div className={this.props.className}>
          　　　　　　<h2>商品の出品</h2>
          <form onSubmit={this.handleSubmit}>
            <FormArea>
              <RequireLiTag>
                <label>商品名</label>
                <InputForm
                  name="name"
                  type="text"
                  value={info.name}
                  onChange={this.handleChange}
                  placeholder="最大100字"
                />
              </RequireLiTag>
              <ValidationMessage
                errorMessage={message.name}
                isShowup={message.name != ''}
                text_color="#D9F1FF"
                margin="10px 0px 0px 140px"
                bg_color="#70AACC"
              />

              <OptionalLiTag>
                <label>状態</label>
                <DropDown onChange={this.handleChange} name="state">
                  <option value="新品">新品、未使用</option>
                  <option value="未使用">未使用に近い</option>
                  <option value="傷や汚れなし">目立った傷や汚れなし</option>
                  <option value="やや傷や汚れあり">やや傷や汚れあり</option>
                  <option value="傷や汚れあり">傷や汚れあり</option>
                  <option value="状態が悪い">全体的に状態が悪い</option>
                </DropDown>
              </OptionalLiTag>

              <RequireLiTag>
                <label>キーワード1</label>
                <InputForm
                  name="keyword1"
                  type="text"
                  value={info.keyword1}
                  onChange={this.handleChange}
                  placeholder="最低1つ設定してください。"
                />
              </RequireLiTag>

              <RequireLiTag>
                <label>キーワード2</label>
                <InputForm
                  name="keyword2"
                  type="text"
                  value={info.keyword2}
                  onChange={this.handleChange}
                />
              </RequireLiTag>

              <RequireLiTag>
                <label>キーワード3</label>
                <InputForm
                  name="keyword3"
                  type="text"
                  value={info.keyword3}
                  onChange={this.handleChange}
                />
              </RequireLiTag>
              <ValidationMessage
                errorMessage={keywordError}
                isShowup={
                  message.keyword1 != '' || message.keyword2 != '' || message.keyword3 != ''
                }
                text_color="#D9F1FF"
                margin="10px 0px 0px 140px"
                bg_color="#70AACC"
              />

              <OptionalLiTag>
                <label>ブランド</label>
                <DropDown name="bland" onChange={this.handleChange}>
                  <option value="">ブランド無し</option>
                  {allBland.map((bland, idx) => {
                    return (
                      <option key={idx} value={bland.id}>
                        {bland.name}
                      </option>
                    );
                  })}
                </DropDown>
              </OptionalLiTag>

              <RequireLiTag>
                <label>カテゴリ</label>
                <DropDown name="category" onChange={this.handleChange}>
                  <option value="">(必須項目)</option>
                  {allCategory.map((category, idx) => {
                    return (
                      <option key={idx} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </DropDown>
              </RequireLiTag>
              <ValidationMessage
                errorMessage={message.category}
                isShowup={message.category != ''}
                text_color="#D9F1FF"
                margin="10px 0px 0px 140px"
                bg_color="#70AACC"
              />

              <ImageLiTag>
                {/*  */}
                <label>商品画像</label>
                {/* Validation適用前から表示させたいためVaildationとは別に記述 */}
                <InputFile type="file" multiple onChange={this.handleImageSelect} />
                {previewPlace}
                {mapImages}
                {deleteUploadedButton}
              </ImageLiTag>
              <ValidationMessage
                errorMessage={message.images}
                isShowup={message.images != ''}
                text_color="#FF737A"
                margin="10px 0px 0px 140px"
                bg_color="#FFBFC2"
              />

              <RequireLiTag>
                <DetailLabel>説明</DetailLabel>
                <StyledTextArea
                  name="detail"
                  value={info.detail}
                  onChange={this.handleChange}
                  placeholder="最大800字(任意)"
                ></StyledTextArea>
              </RequireLiTag>

              <RequireLiTag>
                <SubmitButton
                  btn_type="submit"
                  btn_disable={
                    !info.name ||
                    !info.keyword1 ||
                    info.images.length === 0 ||
                    !info.category ||
                    message.name ||
                    message.keyword1 ||
                    message.keyword2 ||
                    message.keyword3 ||
                    message.images ||
                    message.category
                  }
                >
                  登録
                </SubmitButton>
              </RequireLiTag>
            </FormArea>
          </form>
        </div>
      );
    }
  }
}

export default Give_Item_Add_Form;

const FormArea = styled.ul`
  label {
    ${mixinUlLabel};
    margin-right: 30px;
    width: 110px;
  }
`;

const RequireLiTag = styled.li`
  ${mixinLiTag};
  margin-top: 15px;
`;

const OptionalLiTag = styled(RequireLiTag)`
  margin-bottom: 42px;
`;

const InputForm = styled.input`
  ${mixinInputForm};
`;

const DropDown = styled.select`
  ${mixinDropDown};
  width: 200px;
`;

const DetailLabel = styled.label`
  position: relative;
  bottom: 90px;
`;

const StyledTextArea = styled.textarea`
  ${mixinTextArea};
`;

const ImageLiTag = styled.li`
  display: grid;
  grid-template-columns: 157px 1fr 1fr 1fr 1fr 1fr;
  margin-top: 15px;
  grid-row-gap: 15px;
  align-items: center;
`;

const InputFile = styled.input`
  grid-column: 2 / 7;
  width: 325px;
`;

const Preview_Image = styled.img`
  width: 150px;
  margin-right: 25px;
`;

const Preview_Place_Image = styled.img`
  display: block;
  height: 160px;
  position: relative;
  left: 128px;
  grid-column: 1 / 7;
`;

const DeleteButton = styled.button`
  grid-column: 1 / 7;
  width: ${(props) => 160 * props.imgUrls_length}px;
  position: relative;
  left: 20px;
  margin-top: 10px;
  padding: 5px 10px;
  font-size: 0.76rem;
  color: #6c7880;
  border: 1px solid #6c7880;
  background: white;

  &:hover {
    color: white;
    background: #6c7880;
  }
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
