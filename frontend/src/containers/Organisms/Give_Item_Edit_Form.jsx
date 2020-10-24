import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import history from '../../history';
import styled from 'styled-components';
import MiddleButton from '../../presentational/shared/MiddleButton';
import ValidationMessage from '../../presentational/shared/ValidationMessage';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  Colors,
  mixinUlLabel,
  mixinLiTag,
  mixinInputForm,
  mixinTextArea,
  mixinDropDown,
} from '../../presentational/shared/static/CSSvariables';

class Give_Item_Edit_Form extends Component {
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
      // setBland, setCategory, setStateは編集前のvalue表示用
      setBland: '',
      setCategory: '',
      setState: '',
      allCategory: null,
      allBland: null,
      // 登録済のimageをoriginalImages, プレビューされるのがuploadedImage。
      originalImages: {},
      uploadedImage: [],
      parentItem: '',
      giveItem: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.cancelUploadedImage = this.cancelUploadedImage.bind(this);
    this.handleImageSelect = this.handleImageSelect.bind(this);
    this.deleteOriginal = this.deleteOriginal.bind(this);
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           LifeCycleメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  assignValueToInfoState = (key, assignedValue) => {
    this.setState({ info: { ...this.state.info, [key]: assignedValue } });
  };

  async componentDidMount() {
    const parent_id = parseInt(this.props.parent_id);
    const { axiosUrl, loginUser } = this.props;
    // ドロップダウン式フォームのためにレンダー時にDB内のカテゴリとブランドを全て表示
    await axios
      .all([
        axios.get(axiosUrl + 'bland/'),
        axios.get(axiosUrl + 'category/'),
        axios.get(axiosUrl + 'parent/' + parent_id),
        axios.get(axiosUrl + 'giveitem/?parent_item=' + parent_id),
      ])
      .then(
        axios.spread((resBland, resCategory, resParent, resGive) => {
          this.setState({ ...this.state, allBland: resBland.data });
          this.setState({ ...this.state, allCategory: resCategory.data });
          this.setState({ ...this.state, parentItem: resParent.data });
          this.setState({ ...this.state, giveItem: resGive.data[0] });
          this.assignValueToInfoState('name', resParent.data.name);
          this.assignValueToInfoState('detail', resGive.data[0].detail);
          this.assignValueToInfoState('state', resGive.data[0].state);
          this.setState({ setState: resGive.data[0].state });
        })
      )
      .catch((err) => console.log(err));
    // axios.all closing

    // Parent_ItemのownerじゃないUserがログインした場合、ページ遷移させる
    if (this.state.parentItem.owner != loginUser.id) {
      history.push('/login');
    }

    // 入力必須項目はaxios.allでまとめてGETリクエストを送る
    axios
      .all([
        axios.get(axiosUrl + 'keyword/' + this.state.parentItem.keyword[0]),
        axios.get(axiosUrl + 'category/' + this.state.giveItem.category),
      ])
      .then(
        axios.spread((resKeyword1, resCategory) => {
          this.assignValueToInfoState('keyword1', resKeyword1.data.name);
          this.assignValueToInfoState('category', resCategory.data.id);
          this.setState({ setCategory: resCategory.data.name });
        })
      );

    const fetchDataSetInfo = (url, modelId, targetState) => {
      axios
        .get(axiosUrl + url + modelId)
        .then((res) => {
          this.setState({ info: { ...this.state.info, [targetState]: res.data.name } });
        })
        .catch((err) => console.log(err));
    };

    if (this.state.parentItem.bland !== null) {
      axios.get(axiosUrl + 'bland/' + this.state.parentItem.bland).then((res) => {
        this.assignValueToInfoState('bland', res.data.id);
        this.setState({ setBland: res.data.name });
      });
    }
    // else if (this.state.parentItem.bland === null) {
    //   this.setState({ info: { ...this.state.info, bland: '無し' } });
    // }

    if (this.state.parentItem.keyword[1]) {
      fetchDataSetInfo('keyword/', this.state.parentItem.keyword[1], 'keyword2');
    }

    if (this.state.parentItem.keyword[2]) {
      fetchDataSetInfo('keyword/', this.state.parentItem.keyword[2], 'keyword3');
    }

    axios
      .get(axiosUrl + 'image/?item=' + this.state.giveItem.id)
      .then((res) => {
        res.data.map((imgObject) => {
          this.setState({
            originalImages: { ...this.state.originalImages, [imgObject['id']]: imgObject['image'] },
          });
          this.setState({
            //Submitボタンdisableの条件は、this.state.imagesのlengthが関係するので登録済のimagesをset
            info: { ...this.state.info, images: [...this.state.info.images, imgObject['image']] },
          });
        });
      })
      .catch((err) => console.log(err));
  }

  //
  //
  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           state変更に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========
  //
  //

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
    let uploadedFiles = Array.from(this.state.info.images);
    // 登録済image => string || アップロードimg => blobObject
    // blobObjectのみ抽出
    uploadedFiles = uploadedFiles.filter((file) => typeof file != 'string');
    Promise.all(
      uploadedFiles.map((file) => {
        if (typeof file != 'string') {
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
        }
      })
    )
      .then((images) => {
        images.map((image) => {
          this.setState({ uploadedImage: [...this.state.uploadedImage, image] });
        });
        console.log(this.state.uploadedImage);
      })
      .catch((err) => console.log(err));
  };
  // readImage Closing

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
  // handleImageSelect Closing

  // 新規uploadされた画像を削除するfunction
  cancelUploadedImage = () => {
    // 削除されたアップロード画像がSubmitされないために、filterを用いて削除
    // アップロードされた画像は、BlobObject => これらを除外
    const selectedImages = this.state.info.images.filter((image) => typeof image != 'object');
    this.setState({ info: { ...this.state.info, images: selectedImages } });
    this.setState({ uploadedImage: [] });
  };
  // cancelUploadedImage Closing

  // 登録済画像を削除するためのfunction
  deleteOriginal = (e) => {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    // 登録画像が1枚しか残っていない場合
    if (Object.keys(this.state.originalImages).length === 1) {
      window.alert(
        'この画像が削除されると、登録画像が0になるため削除できません。\n他の画像をアップロード後お試しください。'
      );
      // 削除可能な場合(登録画像が2枚以上残っている)
    } else {
      let result = window.confirm(
        'この画像を削除しますか？(同じ画像を使う場合は、再アップロードが必要です。)'
      );
      if (result) {
        let selectedImgObj = {};
        // onClickと一致する画像URLを持つもののidを抽出して、arrayにいれる。
        const deleteImage = Object.keys(this.state.originalImages).filter(
          (key) => this.state.originalImages[key] == e.target.src
        );
        const delete_id = parseInt(deleteImage[0]);
        //
        // key = Give_Item.id, property = Item_Image.imageとなるオブジェクトのフィルター的役割
        // 登録済imagesから削除imageを取り除く
        for (const key in this.state.originalImages) {
          if (key != delete_id) {
            selectedImgObj = { ...selectedImgObj, [key]: this.state.originalImages[key] };
            console.log(selectedImgObj);
          }
        }
        // state.info.imagesから削除(レンダーさせるため)
        let imagesForState = this.state.info.images.filter((imageUrl) => imageUrl !== e.target.src);
        this.setState({ info: { ...this.state.info, images: imagesForState } });
        this.setState({ originalImages: selectedImgObj });
        axios
          .delete(this.props.axiosUrl + 'image/' + delete_id, authHeader)
          .then((res) => console.log(res))
          .catch((err) => {
            console.log(err);
            window.alert('削除に失敗しました');
          });
      }
    }
  };
  // delete Original 終わり

  //
  //
  //           ===========           ===========
  //           Validation            ===========
  //           ===========           ===========
  //
  //
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

  //
  //
  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleSubmit = async (e) => {
    e.preventDefault();
    const { axiosUrl } = this.props;
    const bland_id = this.state.info.bland;
    const category_id = this.state.info.category;
    let parentItem_id = this.state.parentItem.id;
    let giveItem_id = this.state.giveItem.id;
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
      .put(
        axiosUrl + 'parent/' + parentItem_id + '/',
        {
          name: this.state.info.name,
          // owner: this.state.info.owner,
          bland: bland_id,
          keyword: keyword_ids,
        },
        authHeader
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        window.alert(err.response.data);
      });

    await axios
      .put(
        axiosUrl + 'giveitem/' + giveItem_id + '/',
        {
          state: this.state.info.state,
          category: category_id,
          detail: this.state.info.detail,
          parentItem: parentItem_id,
        },
        authHeader
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        window.alert(err.response.data);
      });

    this.state.info.images
      .filter((image) => typeof image != 'string')
      .map(async (filteredImage) => {
        let data = new FormData();
        await data.append('image', filteredImage);
        await data.append('item', giveItem_id);
        console.log(data);

        axios
          .post(this.props.axiosUrl + 'image/', data, authHeader)
          .then((res) => console.log('You made it ! \n \n' + res.data))
          .catch((err) => window.alert(err.response.data));
      });
  };

  render() {
    const {
      info,
      message,
      allCategory,
      allBland,
      uploadedImage,
      originalImages,
      giveItem,
      parentItem,
      setBland,
      setCategory,
      setState,
    } = this.state;
    let imageMessage;
    let previewedImages;
    let deleteButton;
    // 要素変数　はじめ
    if (info.images.length < 1) {
      imageMessage = (
        <ValidationMessage
          errorMessage="画像は最低1枚設定してください。"
          isShowup={info.images.length < 1}
          text_color="#FF737A"
          margin="10px 0px 0px 140px"
          bg_color="#FFBFC2"
        />
      );
    } else if (info.images.length > 5) {
      imageMessage = (
        <ValidationMessage
          errorMessage="画像は最大5枚までです。"
          isShowup={info.images.length > 5}
          text_color="#FF737A"
          margin="10px 0px 0px 140px"
          bg_color="#FFBFC2"
        />
      );
    }

    if (uploadedImage.length !== 0) {
      previewedImages = uploadedImage.map((img, idx) => {
        return <Preview_Image key={idx} src={img} alc="アップロード写真" />;
      });

      deleteButton = (
        <DeleteButton
          type="button"
          onClick={this.cancelUploadedImage}
          imgUrls_length={uploadedImage.length}
        >
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
    // 要素変数　終わり

    // setStateが完了するまではnullにする。
    if (allCategory === null || allBland === null || parentItem == '' || giveItem == '') {
      return <CircularProgress />;
    } else {
      return (
        <div className={this.props.className}>
          <h2>商品の編集</h2>

          <form onSubmit={this.handleSubmit}>
            <FormArea>
              <RequireLiTag>
                <label>商品名</label>
                <InputForm name="name" type="text" value={info.name} onChange={this.handleChange} />
              </RequireLiTag>
              <ValidationMessage
                errorMessage={message.name}
                isShowup={message.name != ''}
                text_color="#FF737A"
                margin="10px 0px 0px 140px"
                bg_color="#FFBFC2"
              />

              <RequireLiTag>
                <label>状態</label>
                <DropDown
                  onChange={this.handleChange}
                  name="state"
                  defaultValue={this.state.giveItem.state}
                >
                  <option value="新品">新品、未使用</option>
                  <option value="未使用">未使用に近い</option>
                  <option value="傷や汚れなし">目立った傷や汚れなし</option>
                  <option value="やや傷や汚れあり">やや傷や汚れあり</option>
                  <option value="傷や汚れあり">傷や汚れあり</option>
                  <option value="状態が悪い">全体的に状態が悪い</option>
                </DropDown>
              </RequireLiTag>

              <RequireLiTag>
                <label>キーワード1</label>
                <InputForm
                  name="keyword1"
                  type="text"
                  value={info.keyword1}
                  onChange={this.handleChange}
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
                text_color="#FF737A"
                margin="10px 0px 0px 140px"
                bg_color="#FFBFC2"
              />

              <OptionalLiTag>
                <label>ブランド</label>
                <DropDown
                  name="bland"
                  onChange={this.handleChange}
                  defaultValue={this.state.parentItem.bland}
                >
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
                <DropDown
                  name="category"
                  onChange={this.handleChange}
                  defaultValue={this.state.giveItem.category}
                >
                  {allCategory.map((category, idx) => {
                    return (
                      <option key={idx} value={category.id}>
                        {category.name}
                      </option>
                    );
                  })}
                </DropDown>
              </RequireLiTag>

              <ImageLiTag>
                {/*  */}
                <ImageLabel>商品画像</ImageLabel>
                <InputFile type="file" multiple onChange={this.handleImageSelect} />
                {Object.keys(originalImages).map((id) => {
                  return (
                    <Preview_Image
                      key={id}
                      src={originalImages[id]}
                      alt=""
                      onClick={this.deleteOriginal}
                    />
                    );
                  })}
                {/* Validation適用前から表示させたいためVaildationとは別に記述 */}
                {previewedImages}
                {deleteButton}
              </ImageLiTag>
              {imageMessage}

              <RequireLiTag>
                <DetailLabel>説明</DetailLabel>
                <StyledTextArea
                  name="detail"
                  value={info.detail}
                  onChange={this.handleChange}
                ></StyledTextArea>
              </RequireLiTag>

              <SubmitButton
                btn_type="submit"
                btn_disable={
                  !info.name ||
                  !info.keyword1 ||
                  !info.category ||
                  info.state == '' ||
                  info.images.length === 0 ||
                  info.images.length > 5 ||
                  message.name ||
                  message.keyword1 ||
                  message.keyword2 ||
                  message.keyword3 ||
                  message.category ||
                  message.state ||
                  message.images
                }
              >
                編集完了
              </SubmitButton>
            </FormArea>
          </form>
        </div>
      );
    }
  }
}

export default Give_Item_Edit_Form;

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
  width: 250px;
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

const ImageLabel = styled.label`
  &::after {
    content: '画像はクリックで\\A削除できます';
    display: block;
    font-weight: normal;
    font-size: 0.65rem;
    white-space: pre;
  }
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
