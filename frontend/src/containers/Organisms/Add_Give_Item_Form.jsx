import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import * as actions from '../../reducks/auth/actions';
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
        image: '',
        detail: '',
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
        state: '',
        category: '',
        image: '',
        detail: '',
        url: '',
      },
      allCategory: null,
      allBland: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    axios
      .get('http://localhost:8000/api/category')
      .then((res) => {
        this.setState((prevState) => {
          return { ...prevState, allCategory: res.data };
        });
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get('http://localhost:8000/api/user/' + localStorage.getItem('uid'))
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));

    axios.get('http://localhost:8000/api/bland/').then(async (res) => {
      await this.setState({ ...this.state, allBland: res.data });
      console.log('Assignment ' + this.state.allBland);
    });
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

  handleSubmit = async () => {
    let bland_id;
    let keyword_ids = [];
    let parentItem_id;

    if (this.state.info.bland !== '') {
      await axios
        .post('http://localhost:8000/api/bland/', {
          name: this.state.info.bland,
        })
        .then((res) => {
          bland_id = res.data.id;
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (this.state.info.keyword1 !== '') {
      await axios
        .post('http://localhost:8000/api/keyword/', {
          name: this.state.info.keyword1,
        })
        .then((res) => {
          keyword_ids = [...keyword_ids, res.data.id];
          console.log('Keyword1 is ' + keyword_ids);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (this.state.info.keyword2 !== '') {
      await axios
        .post('http://localhost:8000/api/keyword/', {
          name: this.state.info.keyword2,
        })
        .then((res) => {
          keyword_ids = [...keyword_ids, res.data.id];
          console.log('Keyword2 is ' + keyword_ids);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    if (this.state.info.keyword3 !== '') {
      await axios
        .post('http://localhost:8000/api/keyword/', {
          name: this.state.info.keyword3,
        })
        .then((res) => {
          keyword_ids = [...keyword_ids, res.data.id];
          console.log('Keyword3 is ' + keyword_ids);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    await axios
      .post('http://localhost:8000/api/parent/', {
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

    axios
      .post('http://localhost:8000/api/giveitem/', {
        state: this.state.info.state,
        category: this.state.info.category,
        detail: this.state.info.detail,
        parentItem: parentItem_id,
      })
      .then((res) => {
        const giveItem = res.data;
        console.log('giveItem is ' + giveItem);
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
          <label>商品名</label>
          <input
            name="name"
            type="text"
            value={this.state.info.name}
            onChange={this.handleChange}
          />
          <p>{this.state.message.name}</p>

          <label>状態</label>
          <select name="state">
            <option value="新品、未使用">新品、未使用</option>
            <option value="未使用に近い">未使用に近い</option>
            <option value="目立った傷や汚れなし">目立った傷や汚れなし</option>
            <option value="やや傷や汚れあり">やや傷や汚れあり</option>
            <option value="傷や汚れあり">傷や汚れあり</option>
            <option value="全体的に状態が悪い">全体的に状態が悪い</option>
          </select>

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
          <select name="bland" onChange={this.handleChange}>
            {this.state.allBland.map((bland, idx) => {
              return (
                <option key={idx} value={bland.name}>
                  {bland.name}
                </option>
              );
            })}
          </select>

          <label>カテゴリ</label>
          <select name="category" onChange={this.handleChange}>
            <option value="">---</option>
            {this.state.allCategory.map((category) => {
              return <option value={category}>{category.name}</option>;
            })}
          </select>

          <label>説明</label>
          <textarea
            name="detail"
            cols="30"
            rows="10"
            value={this.state.info.detail}
            onChange={this.handleChange}
          ></textarea>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return {
    uid: state.uid,
  };
};

export default connect(mapStateToProps)(Add_Give_Item_Form);
