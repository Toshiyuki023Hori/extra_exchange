import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';

class Add_Want_Item_Form extends Component {
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
        url: '',
      },
      //   Validation用
      // 　urlは必須項目ではないのでValidationには含めない
      message: {
        name: '',
        keyword1: '',
        keyword2: '',
        keyword3: '',
      },
      allBland: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           state変更に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    // ParentItemのownerが外部キーなので、レンダー時にログインユーザーをセット
    axios
      .get(localhostUrl + 'user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ info: { ...this.state.info, owner: res.data } });
        console.log(this.state.info.owner);
      })
      .catch((err) => console.log(err));

    // ドロップダウンにDB内のブランドを表示させるために、レンダー時に全カテゴリをセット
    axios.get(localhostUrl + 'bland/').then(async (res) => {
      await this.setState({ ...this.state, allBland: res.data });
      console.log('Assignment ' + this.state.allBland);
    });
  }

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

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Validation           ===========           ===========
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

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleSubmit = async () => {
    let keywordsList = [];
    let bland_id = this.state.info.bland;
    let keyword_ids = [];
    let parentItem_id;
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

    //
    //Parent_Itemは外部キーbland, keywordを持っているため、
    //先に上記2つのモデルを作成する必要がある。
    //

    await Promise.all(
      keywordsList.map(async (keyword) => {
        await axios
          .post(localhostUrl + 'keyword/', {
            name: keyword,
          })
          .then((res) => {
            keyword_ids = [...keyword_ids, res.data.id];
            console.log('bland_id is ' + bland_id);
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

    //
    // Want_ItemはParent_Itemを外部キーとして持っているため、
    // Parent_Item作成後に、作成される。
    //
    axios
      .post(localhostUrl + 'wantitem/', {
        url: this.state.info.url,
        parentItem: parentItem_id,
      })
      .then((res) => {
        const wantItem = res.data;
        console.log('wantItem is ' + wantItem);
      })
      .catch((err) => {
        console.log(err);
      });

    this.setState({
      info: {
        name: '',
        keyword1: '',
        keyword2: '',
        keyword3: '',
        url: '',
      },
    });
  };

  render() {
    const { info, message } = this.state;
    if (this.state.info.owner === '' || this.state.allBland === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <div>
            <label>商品名</label>
            <input
              name="name"
              type="text"
              value={this.state.info.name}
              onChange={this.handleChange}
            />
            <p>{this.state.message.name}</p>
          </div>

          <div>
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

          <div>
            <label>ブランド</label>
            <select name="bland" onChange={this.handleChange}>
              <option value="">ブランド無し</option>
              {this.state.allBland.map((bland, idx) => {
                return (
                  <option key={idx} value={bland.id}>
                    {bland.name}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label>商品参考URL</label>
            <input
              name="url"
              type="text"
              value={this.state.info.url}
              onChange={this.handleChange}
            />
          </div>

          <input
            type="button"
            value="登録"
            onClick={this.handleSubmit}
            disabled={
              !this.state.info.name ||
              !this.state.info.keyword1 ||
              this.state.message.name ||
              this.state.message.keyword1 ||
              this.state.message.keyword2 ||
              this.state.message.keyword3
            }
          />
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.uid,
    loading: state.loading,
    error: state.error,
  };
};

export default connect(mapStateToProps)(Add_Want_Item_Form);
