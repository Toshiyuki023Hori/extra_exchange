import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { connect } from 'react-redux';
import history from '../../history';
import styled from 'styled-components';
import MiddleButton from '../../presentational/shared/MiddleButton';
import ValidationMessage from '../../presentational/shared/ValidationMessage';
import CircularProgress from '@material-ui/core/CircularProgress';
import down_arrow from '../../assets/DownArrow.png';
import {
  mixinUlLabel,
  mixinInputForm,
  mixinLiTag,
  mixinDropDown,
  Colors,
} from '../../presentational/shared/static/CSSvariables';

class Want_Item_Add_Form extends Component {
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
    // ドロップダウンにDB内のブランドを表示させるために、レンダー時に全カテゴリをセット
    axios.get(this.props.axiosUrl + 'bland/').then(async (res) => {
      await this.setState({ ...this.state, allBland: res.data });
      console.log(this.state.info.owner);
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

  // ===========           ===========           ===========           ===========           ===========
  // ===========           ===========           Form送信に関するメソッド           ===========           ===========
  // ===========           ===========           ===========           ===========           ===========

  handleSubmit = async () => {
    const { axiosUrl } = this.props;
    let keywordsList = [];
    let newKeywords = [];
    let bland_id = this.state.info.bland;
    let keyword_ids = [];
    let parentItem_id;
    let wantItem;
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

    //
    //Parent_Itemは外部キーbland, keywordを持っているため、
    //先に上記2つのモデルを作成する必要がある。
    //

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
      }) // map closing
    ); //   Promise.all closing

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
              // DB内に存在していたキーワードと、新たに作成されたキーワードを一つにまとめる。
              keyword_ids = [...keyword_ids, res.data.id];
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
      })
      .catch((err) => {
        console.log(err);
      });

    //
    // Want_ItemはParent_Itemを外部キーとして持っているため、
    // Parent_Item作成後に、作成される。
    //
    await axios
      .post(
        axiosUrl + 'wantitem/',
        {
          url: this.state.info.url,
          parentItem: parentItem_id,
        },
        authHeader
      )
      .then((res) => {
        wantItem = res.data;
      })
      .catch((err) => {
        console.log(err);
      });

    history.push('/want/edit/' + parentItem_id);
  };

  render() {
    const { info, message, allBland } = this.state;
    let keywordError;

    if (message.keyword1 != '') {
      keywordError = message.keyword1;
    } else if (message.keyword2 != '') {
      keywordError = message.keyword2;
    } else if (message.keyword3 != '') {
      keywordError = message.keyword3;
    }

    if (this.state.info.owner === '' || this.state.allBland === '') {
      return <CircularProgress />;
    } else {
      return (
        <FormArea>

          <h2>欲しいもの商品の追加</h2>

          <TextLiTag>
            <label>商品名</label>
            <InputForm
              name="name"
              type="text"
              value={info.name}
              onChange={this.handleChange}
              placeholder="最低5文字"
            />
          </TextLiTag>
          <ValidationMessage
            errorMessage={message.name}
            isShowup={message.name != ''}
            text_color="#D9F1FF"
            margin="10px 0px 0px 140px"
            bg_color="#70AACC"
          />

          <TextLiTag>
            <label>キーワード1</label>
            <InputForm
              name="keyword1"
              type="text"
              value={info.keyword1}
              onChange={this.handleChange}
              placeholder="最低1つはキーワードを設定してください"
            />
          </TextLiTag>

          <TextLiTag>
            <label>キーワード2</label>
            <InputForm
              name="keyword2"
              type="text"
              value={info.keyword2}
              onChange={this.handleChange}
            />
          </TextLiTag>

          <TextLiTag>
            <label>キーワード3</label>
            <InputForm
              name="keyword3"
              type="text"
              value={info.keyword3}
              onChange={this.handleChange}
            />
          </TextLiTag>
          <ValidationMessage
            errorMessage={keywordError}
            isShowup={message.keyword1 != '' || message.keyword2 != '' || message.keyword3 != ''}
            text_color="#D9F1FF"
            margin="10px 0px 0px 140px"
            bg_color="#70AACC"
          />

          <TextLiTag>
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
          </TextLiTag>

          <TextLiTag>
            <label>商品参考URL</label>
            <InputForm name="url" type="text" value={info.url} onChange={this.handleChange} placeholder='URLをつけることで相手に欲しいもののイメージを伝えることができます(任意)'/>
          </TextLiTag>

          <TextLiTag>
            <SubmitButton
              btn_type="button"
              btn_click={this.handleSubmit}
              btn_disable={
                !info.name ||
                !info.keyword1 ||
                message.name ||
                message.keyword1 ||
                message.keyword2 ||
                message.keyword3
              }
            >
              登録
            </SubmitButton>
          </TextLiTag>
        </FormArea>
      );
    }
  }
}

export default Want_Item_Add_Form;

const FormArea = styled.ul`
  label {
    ${mixinUlLabel};
    margin-right: 30px;
    width: 110px;
  }
`;

const InputForm = styled.input`
  ${mixinInputForm};
`;

const TextLiTag = styled.li`
  ${mixinLiTag};
  margin-top: 15px;
`;

const DropDown = styled.select`
  ${mixinDropDown};
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
