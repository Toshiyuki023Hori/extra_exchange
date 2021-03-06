import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import SmallButton from '../../presentational/shared/SmallButton';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class Want_Item_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: this.props.owner.id,
      loginUser: this.props.loginUser.id,
      // res.dataはオブジェクトをarrayで返してくるため ''
      parentItems: '',
      wantItems: [],
      itemObject: '',
    };
    this.jumpToEdit = this.jumpToEdit.bind(this);
  }

  //            ===========           ===========           ===========           ===========
  //                       componentDidMount 始まり
  //            ===========           ===========           ===========           ===========
  async componentDidMount() {
    let parentItems_ids;
    let objectForState = {};
    const { axiosUrl } = this.props;

    // objectForStateにkeyとpropertyを代入するfunction
    const setObjectForState = (spreadKey, key, value) => {
      objectForState = {
        ...objectForState,
        [spreadKey]: { ...objectForState[spreadKey], [key]: value },
      };
    };

    //
    // Want_ItemはParent_Itemのchild的立ち位置のため、ParentItemを全て取得
    await axios
      .get(axiosUrl + 'parent/?owner=' + this.state.owner)
      .then((res) => {
        this.setState({ parentItems: res.data });
      })
      .catch((err) => console.log(err));
    //
    //
    //  Parent_Itemの中のWant_Itemを抽出
    if (this.state.parentItems != '') {
      await Promise.all(
        this.state.parentItems.map(async (parentItemObj) => {
          await axios.get(axiosUrl + 'wantitem/?parent_item=' + parentItemObj.id).then((res) => {
            //  parameterとparent_item一致 => length = 1のarrayがresponse
            if (res.data.length !== 0) {
              this.setState({ wantItems: [...this.state.wantItems, res.data[0]] });
              //  <li> => [id, name, url]
              //  これらをまとめるために、idをkeyとしたオブジェクトを新規作成
              for (let parentItem of this.state.parentItems) {
                if (parentItem.id == res.data[0].parentItem) {
                  objectForState = {
                    ...objectForState,
                    [parentItem.id]: { name: parentItem.name },
                  };
                }
              } // for of closing
            } //   if (res.data.length) closing tag
          }); //   then closing tag
        }) //      map closing tag
      ); //        Promise all closing tag
    } //           if (this.state.parentItems != '') closing tag

    //
    //Want_Itemからurlとidを抽出、代入
    if (this.state.wantItems.length !== 0) {
      for (const want_item of this.state.wantItems) {
        for (const key in objectForState) {
          if (want_item.parentItem == key) {
            setObjectForState(key, 'url', want_item.url);
            setObjectForState(key, 'want_id', want_item.id);
          }
        } // for in closing
      } //   for of closing
    } //     if closing
    else {
      objectForState = 'まだ登録されているものがありません。';
    }

    this.setState({ itemObject: objectForState });
  }

  //            ===========           ===========           ===========           ===========
  //                       componentDidMount 終わり
  //            ===========           ===========           ===========           ===========

  jumpToEdit = (parent_id) => {
    history.push('/want/edit/' + parent_id);
  };

  handleDelete = (parent_id) => {
    let selectedItems = {};
    const { axiosUrl } = this.props;
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const result = window.confirm('このアイテムを削除しますか??');

    if (result) {
      axios
        .delete(axiosUrl + 'parent/' + parent_id, authHeader)
        .then((res) => {
          for (let key in this.state.itemObject) {
            if (key != parent_id) {
              selectedItems = { ...selectedItems, [key]: this.state.itemObject[key] };
            }
          }
          this.setState({ itemObject: selectedItems });
        })
        .catch((err) => window.alert('削除に失敗しました。'));
    }
  };

  render() {
    const { wantItems, parentItems, itemObject, owner, loginUser } = this.state;
    const { h2Title } = this.props;
    let itemList;
    if (wantItems.length !== 0) {
      itemList = (
        <StyledList>
          {Object.keys(itemObject).map((key, idx) => {
            return (
              <>
                <li key={idx}>
                  {/* URLを持っていたら、リンク先まで飛べるように条件分岐 */}
                  {itemObject[key]['url'] == '' ? (
                    <SpanText key={idx}>{itemObject[key]['name']}</SpanText>
                  ) : (
                    <LinkText key={idx} href={itemObject[key]['url']}>
                      {itemObject[key]['name']}
                    </LinkText>
                  )}

                  {/* ログインユーザーがownerの場合、UpdataとDeleteを許可する */}
                  {owner == loginUser && (
                    <>
                      <StyledSmallButton
                        btn_type="submit"
                        btn_click={() => this.jumpToEdit(key)}
                        btn_name="編集"
                        btn_back={Colors.main}
                        btn_text_color={Colors.accent2}
                      />
                      <StyledSmallButton
                        btn_type="submit"
                        btn_click={() => this.handleDelete(key)}
                        btn_name="削除"
                        btn_back={Colors.accent2}
                        btn_text_color={Colors.subcolor1}
                      />
                    </>
                  )}
                </li>
              </>
            );
          })}{' '}
          {/* Object.keys(itemObject).map closing */}
        </StyledList>
      );
    } // if (wantItems.length !== 0) closing
    else {
      itemList = <NotHaveText>{itemObject}</NotHaveText>;
    }

    if (parentItems === '' || wantItems === [] || itemObject === '') {
      return <CircularProgress />;
    } else {
      return (
        <Wrapper
          margin_left={this.props.margin_left}
          margin_top={this.props.margin_top}
        >
          <h2>{h2Title}</h2>
          <ol>{itemList}</ol>
        </Wrapper>
      );
    }
  }
}

export default Want_Item_List;

const Wrapper = styled.div`
  margin-left: ${(props) => props.margin_left};
  margin-top: ${(props) => props.margin_top};
`;

const StyledList = styled.ol`
  margin-top: 15px;
  margin-left: 30px;

  li {
    font-size: 1.15rem;
    margin-bottom: 17px;
  }
`;

const NotHaveText = styled.p`
  margin-top: 15px;
  margin-left: 30px;
  font-size: 1.15rem;
`;

const SpanText = styled.span`
  display: inline-block;
  margin-right: 60px;
  width: 25em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  bottom: 0.1em;
`;

const LinkText = styled.a`
  text-decoration: underline;
  text-decoration-color: ${Colors.accent1};
  color: ${Colors.accent1};
  margin-right: 60px;
  display: inline-block;
  width: 25em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  vertical-align: middle;
  position: relative;
  bottom: 0.1em;

  &:hover {
    font-weight: 700;
  }
`;

const StyledSmallButton = styled(SmallButton)`
  margin-right: 30px;
  border: none;
`;
