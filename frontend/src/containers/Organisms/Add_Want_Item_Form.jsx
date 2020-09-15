import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core';

class Add_Want_Item_Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //   #インプット情報用
      info: {
        name: '',
        owner: '',
        keyword: '',
        bland: '',
        url: '',
      },
      //   Validation用
      // 　urlは必須項目ではないのでValidationには含めない
      message: {
        name: '',
        keyword: '',
        bland: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/api/user/' + localStorage.getItem('uid'))
      .then((res) => {
        this.setState({ ...this.state, info: { ...this.state.info, owner: res.data } });
        console.log(this.state.info.owner);
      })
      .catch((err) => console.log(err));
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

  validator(name, value) {
    switch (name) {
      case 'name':
        return this.nameValidation(value);
      case 'keyword':
        return this.keywordValidation(value);
      case 'bland':
        return this.blandValidation(value);
    }
  }

  nameValidation(value) {
    if (!value) return '商品名は必須項目です';
    if (value.length < 5) return '商品名は必ず5文字以上入力してください';
    return '';
  }

  keywordValidation(value) {
    if (value.length < 2 && !value == '') return '1文字のキーワードは設定できません';
    return '';
  }

  blandValidation(value) {
    if (value === 1) return 'ブランド名は最低1文字入力してください';
    return '';
  }

  handleSubmit = async () => {
    let bland;
    let keyword;
    let parentItem;

    await axios
      .post('http://localhost:8000/api/bland/', {
        name: this.state.info.bland,
      })
      .then((res) => {
        bland = res.data.id;
        console.log('Bland is ' + bland);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post('http://localhost:8000/api/keyword/', {
        name: this.state.info.keyword,
      })
      .then((res) => {
        keyword = res.data.id;
        console.log('Keyword is ' + keyword);
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .post('http://localhost:8000/api/parent/', {
        name: this.state.info.name,
        owner: this.state.info.owner.id,
        keyword: keyword,
        bland: bland,
      })
      .then((res) => {
        parentItem = res.data.id;
        console.log('Parent is ' + parentItem);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post('http://localhost:8000/api/wantitem/', {
        url: this.state.info.url,
        parentItem: parentItem,
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
        keyword: '',
        bland: '',
        url: '',
      },
    });
  };

  render() {
    const { info, message } = this.state;
    if (this.state.info.owner === '') {
      return null;
    } else {
      return (
        <div>
          <label>商品名</label>
          <input
            name="name"
            type="text"
            value={this.state.info.name}
            onChange={this.handleChange}
          />
          <p>{this.state.message.name}</p>

          <p>{this.state.message.keyword}</p>
          <label>キーワード</label>
          <input
            name="keyword"
            type="text"
            value={this.state.info.keyword}
            onChange={this.handleChange}
          />

          <label>ブランド</label>
          <input
            name="bland"
            type="text"
            value={this.state.info.bland}
            onChange={this.handleChange}
          />
          <p>{this.state.message.bland}</p>

          <label>商品参考URL</label>
          <input name="url" type="text" value={this.state.info.url} onChange={this.handleChange} />
          <input type="button" value="登録" onClick={this.handleSubmit} />
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
