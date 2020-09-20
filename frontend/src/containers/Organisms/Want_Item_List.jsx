import React, { Component } from 'react';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import SmallButton from '../../presentational/shared/SmallButton';

class Want_Item_List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: this.props.owner.id,
      loginUser: this.props.loginUser.id,
      // res.dataはオブジェクトをarrayで返してくるため ''
      parentItems: '',
      // 後にarrayメソッドを使うため empty array.
      wantItems: [],
      inIdUrlName: '',
    };
  }

  async componentDidMount() {
    let parentItems_ids;
    let sendToInIdUrl = {};

    //
    //
    // Want_ItemはParent_Itemのchild的立ち位置のため、ParentItemを全て取得
    await axios
      .get(this.props.axiosUrl + 'parent/?owner=' + this.state.owner)
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
    await Promise.all(
      Object.keys(parentItems_ids).map(async (key) => {
        await axios.get(this.props.axiosUrl + 'wantitem/?parent_item=' + key).then((res) => {
          //  Want_DataのparentItemと、Parent_Itemが一致した場合、
          //  length == 1 のArrayが返ってくるため、それの条件分岐
          if (res.data.length !== 0) {
            this.setState({ wantItems: [...this.state.wantItems, res.data[0]] });
            //  <li>タグのディスプレイ時に欲しい情報は、id, name, url
            //  これらをまとめるために、idをkeyとしたオブジェクトを新規作成
            for (let parentItem of this.state.parentItems) {
              if (parentItem.id == res.data[0].parentItem) {
                sendToInIdUrl = { ...sendToInIdUrl, [parentItem.id]: { name: parentItem.name } };
              }
            }
          }
        });
      })
    );

    //
    //
    //取得したWant_Itemからurlを抽出して、オブジェクトに代入する。
    for (const want_item of this.state.wantItems) {
      for (const key in sendToInIdUrl) {
        if (want_item.parentItem == key) {
          sendToInIdUrl = {
            ...sendToInIdUrl,
            [key]: { ...sendToInIdUrl[key], url: want_item.url },
          };
        }
      }
    }

    this.setState(this.setState({ inIdUrlName: sendToInIdUrl }));
  }

  render() {
    if (
      this.state.wantItems === [] ||
      this.state.parentItems === '' ||
      this.state.inIdUrlName === ''
    ) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <h2>{this.props.h2Title}</h2>
          <ol>
            {this.state.wantItems.length === 0
              ? null
              : Object.keys(this.state.inIdUrlName).map((key) => {
                  return (
                    <>
                      <li>
                        {/* URLを持っていたら、リンク先まで飛べるように条件分岐 */}
                        {this.state.inIdUrlName[key]['url'] == '' ? (
                          this.state.inIdUrlName[key]['name']
                        ) : (
                          <a href={this.state.inIdUrlName[key]['url']}>
                            {this.state.inIdUrlName[key]['name']}
                          </a>
                        )}
                      </li>
                      {/* ログインユーザーがownerの場合、UpdataとDeleteを許可する */}
                      {this.state.owner == this.state.loginUser ? (
                        <>
                          <SmallButton
                            btn_type="submit"
                            btn_click={this.handleDelete}
                            btn_name="削除"
                          />
                          <SmallButton
                            btn_type="submit"
                            btn_click={this.handleEdit}
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
