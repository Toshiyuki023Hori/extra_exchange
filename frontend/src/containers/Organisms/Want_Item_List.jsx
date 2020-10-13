import React, { Component } from 'react';
import axios from 'axios';
import styled from "styled-components";
import history from '../../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import SmallButton from '../../presentational/shared/SmallButton';
import { Colors } from "../../presentational/shared/static/CSSvariables";

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
    const setObjectForState = (spreadKey, key ,value) => {
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
        for (let i = 0; i < this.state.parentItems.length; i++) {
          // Want_Item取得に、Parent_Itemのidが必要になるので、idだけをarrayに代入
          parentItems_ids = {
            ...parentItems_ids,
            [this.state.parentItems[i].id]: { name: this.state.parentItems[i].name },
          };
        }
      })
      .catch((err) => console.log(err));
    //
    //
    //  ユーザーが持つParent_Itemの中のWant_Itemを取得する
    if (this.state.parentItems != '') {
      await Promise.all(
        Object.keys(parentItems_ids).map(async (key) => {
          await axios.get(axiosUrl + 'wantitem/?parent_item=' + key).then((res) => {
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
            }  //  if (res.data.length) closing tag
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
            setObjectForState(key, "url", want_item.url);
            setObjectForState(key, "want_id", want_item.id);
          }
        } // for in closing
      } //   for of closing
    } //     if closing
    else {
      objectForState = 'まだ登録されているものがありません。'
    }

    this.setState({ itemObject: objectForState });
  }

  //            ===========           ===========           ===========           ===========
  //                       componentDidMount 終わり
  //            ===========           ===========           ===========           ===========

  jumpToEdit = (parent_id) => {
    history.push('/want/' + parent_id + '/edit');
  };

  handleDelete = (parent_id) => {
    let filteredItems = {};
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
              filteredItems = { ...filteredItems, [key]: this.state.itemObject[key] };
            }
          }
          this.setState({ itemObject: filteredItems });
        })
        .catch((err) => window.alert('削除に失敗しました。'));
    }
  };

  render() {
    const { wantItems, parentItems, itemObject, owner, loginUser } = this.state;
    const { h2Title } = this.props;
    let itemList;
    if (wantItems.length !== 0) {
      itemList = 
      <StyledList>
        {
        Object.keys(itemObject).map((key, idx) => {
          return (
            <>
              <li key={idx}>
                {/* URLを持っていたら、リンク先まで飛べるように条件分岐 */}
                {itemObject[key]['url'] == '' ? (
                  itemObject[key]['name']
                ) : (
                  <LinkText key={idx} href={itemObject[key]['url']}>
                    {itemObject[key]['name']}
                  </LinkText>
                )}
              </li>
              {/* ログインユーザーがownerの場合、UpdataとDeleteを許可する */}
              {owner == loginUser && (
                <>
                  <SmallButton
                    btn_type="submit"
                    btn_click={() => this.handleDelete(key)}
                    btn_name="削除"
                  />
                  <SmallButton
                    btn_type="submit"
                    btn_click={() => this.jumpToEdit(key)}
                    btn_name="編集"
                  />
                </>
              )}
            </>
          );
        })
        }
      </StyledList>
    } else {
      itemList = <p>{itemObject}</p>
    }

    if (parentItems === '' || wantItems === [] || itemObject === '') {
      return <CircularProgress />;
    } else {
      return (
        <Wrapper margin_left={this.props.margin_left}>
          <h2>{h2Title}</h2>
          <ol>{itemList}</ol>
        </Wrapper>
      );
    }
  }
}

export default Want_Item_List;

const Wrapper = styled.div`
  margin-left:${(props) => props.margin_left};
`;

const StyledList = styled.ol`
  margin-top:15px;
  margin-left:30px;
  
  li{
    font-size:1.15rem;
    margin-bottom:10px;
  }
`;

const LinkText = styled.a`
  text-decoration:none;
  color:${Colors.accent1};
  position:relative;

  &::after{
    position:absolute;
    left:0;
    bottom:-4px;
    content:"";
    width:100%;
    height:2px;
    background:${Colors.accent1};
    transform:scale(0,1);
    transform-origin:center top;
    transition:transform .3s;
  }

  &:hover{
    font-weight:700;
  }

  &:hover::after{
    transform:scale(1.1);
  }
`;