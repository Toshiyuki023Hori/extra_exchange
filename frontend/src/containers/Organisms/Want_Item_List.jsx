import React, { Component } from 'react';
import axios from 'axios';
import history from '../../history';
import CircularProgress from '@material-ui/core/CircularProgress';
import SmallButton from '../../presentational/shared/SmallButton';
import zIndex from '@material-ui/core/styles/zIndex';

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
            //  Want_DataのparentItemと、Parent_Itemが一致した場合、
            //  length == 1 のArrayが返ってくるため、それの条件分岐
            if (res.data.length !== 0) {
              this.setState({ wantItems: [...this.state.wantItems, res.data[0]] });
              //  <li>タグのディスプレイ時に欲しい情報は、id, name, url
              //  これらをまとめるために、idをkeyとしたオブジェクトを新規作成
              for (let parentItem of this.state.parentItems) {
                if (parentItem.id == res.data[0].parentItem) {
                  objectForState = {
                    ...objectForState,
                    [parentItem.id]: { name: parentItem.name },
                  };
                  console.log(objectForState);
                }
              }
            }
          });
        })
      );
    }

    //
    //
    //取得したWant_Itemからurlを抽出して、オブジェクトに代入する。
    if (this.state.wantItems.length != 0) {
      for (const want_item of this.state.wantItems) {
        for (const key in objectForState) {
          if (want_item.parentItem == key) {
            objectForState = {
              ...objectForState,
              [key]: { ...objectForState[key], url: want_item.url },
            };
            objectForState = {
              ...objectForState,
              [key]: { ...objectForState[key], want_id: want_item.id },
            };
            console.log(objectForState);
          }
        }
      }
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
    if (parentItems === '' || wantItems === [] || itemObject === '') {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <h2>{h2Title}</h2>
          <ol>
            {wantItems.length === 0
              ? null
              : Object.keys(itemObject).map((key, idx) => {
                  return (
                    <>
                      <li key={idx}>
                        {/* URLを持っていたら、リンク先まで飛べるように条件分岐 */}
                        {itemObject[key]['url'] == '' ? (
                          itemObject[key]['name']
                        ) : (
                          <a href={itemObject[key]['url']}>{itemObject[key]['name']}</a>
                        )}
                      </li>
                      {/* ログインユーザーがownerの場合、UpdataとDeleteを許可する */}
                      {owner == loginUser ? (
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
                      ) : null}
                    </>
                  );
                })}
          </ol>
        </div>
      );
    }
  }
}

export default Want_Item_List;
