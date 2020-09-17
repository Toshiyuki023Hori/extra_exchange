import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
import MiddleButton from '../../presentational/shared/MiddleButton';
import CircularProgress from '@material-ui/core/CircularProgress';

class Add_Give_Item_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   #インプット情報用
      info: {
        name: '',
        owner: '',
        keyword1: '',
        keyword2: '',
        keyword3: '',
        bland: '',
        state: '未使用、新品',
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
    const localhostUrl = 'http://localhost:8000/api/';

    // Parent_ItemとGive_Itemは外部キーとしてUserを持っているため、レンダー時にログインユーザーを取得
    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ info: { ...this.state.info, owner: res.data } });
        console.log(this.state.info.owner);
      })
      .catch((err) => console.log(err));

    // ドロップダウン式フォームのためにレンダー時にDB内のカテゴリとブランドを全て表示
    axios.get(localhostUrl + 'bland/').then(async (res) => {
      await this.setState({ ...this.state, allBland: res.data });
      console.log('Assignment ' + this.state.allBland);
    });

    axios.get(localhostUrl + 'category/').then((res) => {
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
    console.log(this.state.info.images);
    // 画像データのURLをthis.state.imgUrlsへ送る。
    this.readImageUrl();
  };

  // 選択された画像を全て削除するためのボタン用
  cancelUploadedImage = () => {
    this.setState({ info: { ...this.state.info, images: [] } });
    this.setState({ imgUrls: [] });
  };

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           　Validation　         ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

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
    if (value.length < 2 && !value == '') return '1文字のキーワードは設定できません';
    return '';
  }

  categoryValidation(value) {
    if (value === '') {
      return 'カテゴリーは必須項目です。';
    }
    return '';
  }

  imageValidation() {
    if (this.state.info.images > 5) {
      return '設定できる画像は5枚までです。';
    }
    return '';
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleSubmit = async () => {
    let keywordsList = [];
    let bland_id;
    let category_id;
    let keyword_ids = [];
    let parentItem_id;
    let giveItem_id;
    const localhostUrl = 'http://localhost:8000/api/';

    const hasValueInKeyword = (keyword) => {
      if (keyword !== '') {
        keywordsList = [...keywordsList, keyword];
      } else {
      }
    };

    hasValueInKeyword(this.state.info.keyword1);
    hasValueInKeyword(this.state.info.keyword2);
    hasValueInKeyword(this.state.info.keyword3);

    // Parent_Item = name, owner , keyword(Keyword), bland(Bland)
    // Give_Item = state, detail, category(Category), parent_item(Parent_Item)
    // Item_Image = image, Item(Give_Item)
    // Category = name
    // Bland = name
    // Keyword = name

    // モデル作成順序
    // Bland, Category, Keyword => Parent_Item => Give_Item => Item_Image

    await axios
      .all([
        axios.post(localhostUrl + 'bland/', {
          name: this.state.info.bland,
        }),
        axios.post(localhostUrl + 'category/', {
          name: this.state.info.category,
        }),
      ])
      .then(
        axios.spread((blandData, categoryData) => {
          category_id = categoryData.data.id;
          bland_id = blandData.data.id;
          console.log('Succeeded, bland is ' + bland_id + 'and ' + category_id);
        })
      )
      .catch((err) => console.log(err));

    await Promise.all(
      keywordsList.map(async (keyword) => {
        await axios
          .post(localhostUrl + 'keyword/', {
            name: keyword,
          })
          .then((res) => {
            keyword_ids = [...keyword_ids, res.data.id];
          })
          .catch((err) => console.log(err));
      })
    );

    await axios
      .post(localhostUrl + 'parent/', {
        name: this.state.info.name,
        owner: this.state.info.owner.id,
        bland: bland_id,
        keyword: keyword_ids,
      })
      .then((res) => {
        parentItem_id = res.data.id;
        console.log('Parent is ' + parentItem_id);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post(localhostUrl + 'giveitem/', {
        state: this.state.info.state,
        category: category_id,
        detail: this.state.info.detail,
        parentItem: parentItem_id,
      })
      .then((res) => {
        giveItem_id = res.data.id;
        console.log('giveItem is ' + giveItem_id);
      })
      .catch((err) => {
        console.log(err);
      });

    this.state.info.images.forEach((image) => {
      axios
        .post(localhostUrl + 'image/', {
          image: image,
          item: giveItem_id,
        })
        .then((res) => console.log(res.data))
        .catch((err) => console.log(err));
    });

    this.setState({
      info: {
        name: '',
        keyword1: '',
        keyword2: '',
        keyword3: '',
        detail: '',
      },
    });
  };

  render() {
    const { info, message, allCategory, allBland } = this.state;
    // setStateが完了するまではnullにする。
    if (this.state.allCategory === null || this.state.allBland === null) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <div className="nameForm textForm">
            <label>商品名</label>
            <input
              name="name"
              type="text"
              value={this.state.info.name}
              onChange={this.handleChange}
            />
            <p>{this.state.message.name}</p>
          </div>

          <div className="stateForm dropdownForm">
            <label>状態</label>
            <select name="state">
              <option value="新品、未使用">新品、未使用</option>
              <option value="未使用に近い">未使用に近い</option>
              <option value="目立った傷や汚れなし">目立った傷や汚れなし</option>
              <option value="やや傷や汚れあり">やや傷や汚れあり</option>
              <option value="傷や汚れあり">傷や汚れあり</option>
              <option value="全体的に状態が悪い">全体的に状態が悪い</option>
            </select>
          </div>

          <div className="keywordForm textForm">
            {/* keywordのみValidationを一つに見せるため、上部に全てのメッセージを集約 */}
            <p>{this.state.message.keyword1}</p>
            <p>{this.state.message.keyword2}</p>
            <p>{this.state.message.keyword3}</p>

            <label>キーワード1</label>
            <input
              name="keyword1"
              type="text"
              value={this.state.info.keyword1}
              onChange={this.handleChange}
            />

            <label>キーワード2</label>
            <input
              name="keyword2"
              type="text"
              value={this.state.info.keyword2}
              onChange={this.handleChange}
            />

            <label>キーワード3</label>
            <input
              name="keyword3"
              type="text"
              value={this.state.info.keyword3}
              onChange={this.handleChange}
            />
          </div>

          <div className="blandForm dropdownForm">
            <label>ブランド</label>
            <select name="bland" onChange={this.handleChange}>
              {this.state.allBland.map((bland, idx) => {
                return (
                  <option key={idx} value={bland.name}>
                    {bland.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="categoryForm dropdownForm">
            <label>カテゴリ</label>
            <select name="category" onChange={this.handleChange}>
              <option value="">---</option>
              {this.state.allCategory.map((category) => {
                return <option value={category}>{category.name}</option>;
              })}
            </select>
            <p>{this.state.message.category}</p>
          </div>

          <div className="imageForm">
            <label>商品画像</label>
            {/* Validation適用前から表示させたいためVaildationとは別に記述 */}
            {this.state.imgUrls.length === 0 ? <p>画像は最低一枚投稿してください。</p> : null}
            <input type="file" multiple onChange={this.handleImageSelect} />
            {this.state.imgUrls.length === 0
              ? null
              : this.state.imgUrls.map((img, idx) => {
                  return <img key={idx} src={img} alc="アップロード写真" height="150px"></img>;
                })}
            {this.state.imgUrls.length === 0 ? null : (
              <button onClick={this.cancelUploadedImage}>画像取り消し</button>
            )}
          </div>

          <div className="detailForm textarea">
            <label>説明</label>
            <textarea
              name="detail"
              cols="30"
              rows="10"
              value={this.state.info.detail}
              onChange={this.handleChange}
            ></textarea>
          </div>

          <MiddleButton
            btn_name="登録"
            btn_type="submit"
            btn_func={this.handleSubmit}
            btn_disable={
              !this.state.info.name ||
              !this.state.info.keyword1 ||
              this.state.info.images.length === 0 ||
              !this.state.info.category ||
              this.state.message.name ||
              this.state.message.keyword1 ||
              this.state.message.keyword2 ||
              this.state.message.keyword3 ||
              this.state.message.images ||
              this.state.message.category
            }
          />
        </div>
      );
    }
  }
}

export default Add_Give_Item_Form;
