import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import history from '../../history';
import MiddleButton from '../../presentational/shared/MiddleButton';
import CircularProgress from '@material-ui/core/CircularProgress';

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
      setBland: '',
      setCategory: '',
      setState: '',
      allCategory: null,
      allBland: null,
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
          this.setState({ info: { ...this.state.info, name: resParent.data.name } });
          this.setState({ info: { ...this.state.info, state: resGive.data[0].state } });
          this.setState({ setState: resGive.data[0].state });
          this.setState({ info: { ...this.state.info, detail: resGive.data[0].detail } });
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
        axios.get(axiosUrl + 'category/' + this.state.giveItem.category),
        axios.get(axiosUrl + 'keyword/' + this.state.parentItem.keyword[0]),
      ])
      .then(
        axios.spread((resCategory, resKeyword1) => {
          this.setState({ info: { ...this.state.info, category: resCategory.data.id } });
          this.setState({ setCategory: resCategory.data.name });
          this.setState({ info: { ...this.state.info, keyword1: resKeyword1.data.name } });
        })
      );

    const fromApiToInfo = (url, modelId, targetState) => {
      axios
        .get(axiosUrl + url + modelId)
        .then((res) => {
          this.setState({ info: { ...this.state.info, [targetState]: res.data.name } });
        })
        .catch((err) => console.log(err));
    };

    if (this.state.parentItem.bland !== null) {
      axios.get(axiosUrl + 'bland/' + this.state.parentItem.bland).then((res) => {
        this.setState({ info: { ...this.state.info, bland: res.data.id } });
        this.setState({ setBland: res.data.name });
      });
    } else if (this.state.parentItem.bland === null) {
      this.setState({ info: { ...this.state.info, bland: '無し' } });
    }

    if (this.state.parentItem.keyword[1]) {
      fromApiToInfo('keyword/', this.state.parentItem.keyword[1], 'keyword2');
    }

    if (this.state.parentItem.keyword[2]) {
      fromApiToInfo('keyword/', this.state.parentItem.keyword[2], 'keyword3');
    }

    axios
      .get(axiosUrl + 'image/?item=' + this.state.giveItem.id)
      .then((res) => {
        res.data.map((imgObject) => {
          this.setState({
            originalImages: { ...this.state.originalImages, [imgObject['id']]: imgObject['image'] },
          });
          this.setState({
            //Submitボタンdisableの条件は、this.state.imagesなのでこちらにもset
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
    let files = Array.from(this.state.info.images);
    files = files.filter((file) => typeof file != 'string');
    Promise.all(
      files.map((file) => {
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
  // readImage 終わり

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
    // 削除されたアップロード画像がSubmitされないために、filterを用いて削除
    // アップロードされた画像は、BlobObject
    const filteredImages = this.state.info.images.filter((image) => typeof image != 'object');
    this.setState({ info: { ...this.state.info, images: filteredImages } });
    this.setState({ uploadedImage: [] });
  };

  deleteOriginal = (e) => {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    
    if(Object.keys(this.state.originalImages).length === 1){
      window.alert("この画像が削除されると、登録画像が0になるため削除できません。\n他の画像をアップロード後お試しください。")
    }else{   
      let result = window.confirm(
        'この画像を削除しますか？(同じ画像を使う場合は、再アップロードが必要です。)'
      );
    if (result) {
      let storeFilteredImg = {};
      const deleteImage = Object.keys(this.state.originalImages).filter(
        (key) => this.state.originalImages[key] == e.target.src
      );
      const delete_id = parseInt(deleteImage[0]);
      // key = Give_Item.id, property = Item_Image.imageとなるオブジェクトのフィルター的役割
      for (const key in this.state.originalImages) {
        if (key != delete_id) {
          storeFilteredImg = { ...storeFilteredImg, [key]: this.state.originalImages[key] };
          console.log(storeFilteredImg);
        }
      }
      // state.info.imagesから削除(レンダーさせるため)
      let passToState = this.state.info.images.filter((imageUrl) => imageUrl !== e.target.src);
      this.setState({ info: { ...this.state.info, images: passToState } });
      this.setState({ originalImages: storeFilteredImg });
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
      case 'category':
        return this.categoryValidation(value);
      case 'state':
        return this.stateValidation(value);
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

  stateValidation(value) {
    if (value === '') {
      return '商品の状態を選択してください';
    }
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

    const hasValueInKeyword = (keyword) => {
      if (keyword !== '') {
        keywordsList = [...keywordsList, keyword];
      } else {
      }
    };

    hasValueInKeyword(this.state.info.keyword1);
    hasValueInKeyword(this.state.info.keyword2);
    hasValueInKeyword(this.state.info.keyword3);

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
        console.log(err);
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
        console.log(err);
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
          .catch((err) => console.log(err));
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
      setBland,
      setCategory,
      setState,
    } = this.state;
    let imageMessage;
    let previewedImages;
    let deleteButton;
    // 要素変数　はじめ
    if (info.images.length < 1) {
      imageMessage = <p>画像は最低一枚設定してください。</p>;
    } else if (info.images.length > 5) {
      imageMessage = <p>画像は最大5枚までです。</p>;
    }

    if (uploadedImage.length !== 0) {
      previewedImages = uploadedImage.map((img, idx) => {
        return <img key={idx} src={img} alc="アップロード写真" height="150px" />;
      });

      deleteButton = (
        <button type="button" onClick={this.cancelUploadedImage}>
          画像取り消し
        </button>
      );
    }
    // 要素変数　終わり

    // setStateが完了するまではnullにする。
    if (allCategory === null || allBland === null) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <form onSubmit={this.handleSubmit}>
            <div className="nameForm textForm">
              <label>商品名</label>
              <input name="name" type="text" value={info.name} onChange={this.handleChange} />
              <p>{message.name}</p>
            </div>

            <div className="stateForm dropdownForm">
              <label>状態</label>
              <span> : {setState}</span>
              <select onChange={this.handleChange} name="state">
                <option value="">商品状態を選択</option>
                <option value="新品">新品、未使用</option>
                <option value="未使用">未使用に近い</option>
                <option value="傷や汚れなし">目立った傷や汚れなし</option>
                <option value="やや傷や汚れあり">やや傷や汚れあり</option>
                <option value="傷や汚れあり">傷や汚れあり</option>
                <option value="状態が悪い">全体的に状態が悪い</option>
              </select>
              <p>{message.state}</p>
            </div>

            <div className="keywordForm textForm">
              {/* keywordのみValidationを一つに見せるため、上部に全てのメッセージを集約 */}
              <p>{message.keyword1}</p>
              <p>{message.keyword2}</p>
              <p>{message.keyword3}</p>

              <label>キーワード1</label>
              <input
                name="keyword1"
                type="text"
                value={info.keyword1}
                onChange={this.handleChange}
              />

              <label>キーワード2</label>
              <input
                name="keyword2"
                type="text"
                value={info.keyword2}
                onChange={this.handleChange}
              />

              <label>キーワード3</label>
              <input
                name="keyword3"
                type="text"
                value={info.keyword3}
                onChange={this.handleChange}
              />
            </div>

            <div className="blandForm dropdownForm">
              <label>ブランド</label>
              <span> : {setBland}</span>
              <select name="bland" onChange={this.handleChange}>
                <option value="">ブランド無し</option>
                {allBland.map((bland, idx) => {
                  return (
                    <option key={idx} value={bland.id}>
                      {bland.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="categoryForm dropdownForm">
              <label>カテゴリ</label>
              <span> : {setCategory}</span>
              <select name="category" onChange={this.handleChange}>
                <option value="">---</option>
                {allCategory.map((category, idx) => {
                  return (
                    <option key={idx} value={category.id}>
                      {category.name}
                    </option>
                  );
                })}
              </select>
              <p>{message.category}</p>
            </div>

            <div className="imageForm">
              {imageMessage}
              {/*  */}
              <label>商品画像</label>
              <p>設定画像一覧</p>
              {Object.keys(originalImages).map((id) => {
                return (
                  <img
                    key={id}
                    src={originalImages[id]}
                    alt=""
                    height="150px"
                    onClick={this.deleteOriginal}
                  />
                );
              })}
              {/* Validation適用前から表示させたいためVaildationとは別に記述 */}
              {info.images.length === 0 && <p>画像は最低一枚設定してください。</p>}
              <p>
                <input type="file" multiple onChange={this.handleImageSelect} />
              </p>
              {previewedImages}
              {deleteButton}
            </div>

            <div className="detailForm textarea">
              <label>説明</label>
              <textarea
                name="detail"
                cols="30"
                rows="10"
                value={info.detail}
                onChange={this.handleChange}
              ></textarea>
            </div>

            <MiddleButton
              btn_name="登録"
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
            />
          </form>
        </div>
      );
    }
  }
}

export default Give_Item_Edit_Form;
