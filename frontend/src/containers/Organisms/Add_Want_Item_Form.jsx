import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
import CircularProgress from "@material-ui/core"

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
        bland: '',
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/api/user/' + this.state.uid)
      .then((res) => console.log(res))
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
      case 'keyword1':
        return this.keywordValidation(value);
      case 'keyword2':
        return this.keywordValidation(value);
      case 'keyword3':
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
    if (!this.state.info.keyword1 && !this.state.info.keyword2 && !this.state.info.keyword3)
      return 'キーワードは最低1つ設定してください。';
    if (value.length < 2 && !value == '') return '1文字のキーワードは設定できません';
    return '';
  }

  blandValidation(value) {
    if (!value) return 'ブランド名は最低1文字入力してください';
    return '';
  }

  render() {
    const { info, message } = this.state;
    return (
      <div>
        <label>商品名</label>
        <input name="name" type="text" value={this.state.info.name} onChange={this.handleChange} />
        <p>{this.state.message.name}</p>

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
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.uid,
    loading : state.loading,
    error:state.error
  };
};

export default connect(mapStateToProps)(Add_Want_Item_Form);
