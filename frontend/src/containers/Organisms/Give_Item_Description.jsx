import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import { CircularProgress, Chip } from '@material-ui/core';
import Carousel from '../../presentational/shared/Carousel';
import MiddleButton from '../../presentational/shared/MiddleButton';
import CategoryTag from '../../presentational/shared/CategoryTag';
import { Colors } from '../../presentational/shared/static/CSSvariables';

class Give_Item_Description extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      parentItem: '',
      giveItem: '',
      pickups: [],
      images: [],
      category_id:'',
      sentRequest: false,
    };
    this.jumpToEdit = this.jumpToEdit.bind(this);
    this.jumpToRequest = this.jumpToRequest.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  setDataToState = (key, value) => {
    this.setState({ [key]: value });
  };

  spreadDataToObject = (spreadKey, key, value) => {
    this.setState({ [spreadKey]: { ...this.state[spreadKey], [key]: value } });
  };

  spreadDataToArray = (spreadKey, value) => {
    this.setState({ [spreadKey]: [...this.state[spreadKey], value] });
  };

  async componentDidMount() {
    const { axiosUrl, loginUser, setGiveItem } = this.props;
    const parent_id = parseInt(this.props.parent_id);
    let requestDealsOfUser;

    //
    await axios
      .all([
        axios.get(axiosUrl + 'parent/' + parent_id),
        axios.get(axiosUrl + 'giveitem/?parent_item=' + parent_id),
      ])
      .then(
        axios.spread((resParent, resGive) => {
          this.setDataToState('parentItem', resParent.data);
          this.setDataToState('giveItem', resGive.data[0]);
          this.setDataToState('category_id', resGive.data[0].category);
          setGiveItem(resGive.data[0].id);
        })
      )
      .catch((err) => console.log(err));

    // giveItem内のcategoryをidからnameへ
    axios.get(axiosUrl + 'category/' + this.state.giveItem.category).then((res) => {
      this.spreadDataToObject('giveItem', 'category', res.data.name);
    });

    // giveItem内のblandをidからnameへ
    if (this.state.parentItem.bland !== null) {
      axios.get(axiosUrl + 'bland/' + this.state.parentItem.bland).then((res) => {
        this.spreadDataToObject('parentItem', 'bland', res.data.name);
      });
    } else if (this.state.parentItem.bland === null) {
      this.spreadDataToObject('parentItem', 'bland', '無し');
    }

    // imageとpickupをarrayで取得
    await axios
      .all([
        axios.get(axiosUrl + 'image/?item=' + this.state.giveItem.id),
        axios.get(axiosUrl + 'pickup/?choosingUser=' + this.state.parentItem.owner),
      ])
      .then(
        axios.spread((resImages, resPickups) => {
          resImages.data.map((imageObj) => {
            this.spreadDataToArray('images', imageObj.image);
          });
          resPickups.data.map((pickupObj) => {
            this.spreadDataToArray('pickups', pickupObj.name);
          });
        })
      );

    // loginUserの持つrequest_dealを全件取得
    await axios
      .get(axiosUrl + 'requestdeal/?join_user=' + loginUser.id)
      .then((res) => {
        if (res.data.length !== 0) {
          requestDealsOfUser = res.data;
          console.log(requestDealsOfUser);
        } else {
          requestDealsOfUser = 'リクエスト送信なし';
        }
      })
      .catch((err) => (requestDealsOfUser = 'リクエスト送信なし'));

    // loginUserが一件でもリクエストを送っていたら
    // 取得したrequest_dealの中で、host_itemと一致してるか確認
    // hostItem = parent_id => リクエスト送信済
    if (requestDealsOfUser !== 'リクエスト送信なし') {
      for (const reqDealObj of requestDealsOfUser) {
        console.log(reqDealObj.hostItem);
        if (reqDealObj.hostItem === parent_id) {
          this.setState({ sentRequest: true });
        }
      }
    }

    this.setState({ loading: false });
  }
  //
  //  //  //  // componentDidMount Fin
  //

  jumpToEdit = () => {
    history.push('/give/edit/' + this.props.parent_id);
  }; // jumpToEdit Closing

  jumpToRequest = () => {
    history.push('/give/request/' + this.props.parent_id);
  };

  handleDelete = () => {
    const { axiosUrl } = this.props;
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };

    let result = window.confirm('この商品を削除しますか？');
    if (result) {
      axios
        .delete(axiosUrl + 'parent/' + this.props.parent_id, authHeader)
        .then((res) => history.push('/user/' + this.props.loginUser.id))
        .catch((err) => {
          console.log(err);
          window.alert('削除に失敗しました');
        });
    }
  }; //    handleDelete Closing

  render() {
    const { parentItem, giveItem, pickups, images, loading, category_id, sentRequest } = this.state;
    const owner = parentItem.owner;
    let editButton;
    let deleteButton;
    let requestButton;
    let pickupView;
    let alertMessage;

    // dateTimeを表示用にフォーマット。
    const formatDataForDisplay = (dataTime) => {
      console.log(dataTime);
      const year = dataTime.slice(0, 4);
      const month = dataTime.slice(5, 7);
      const day = dataTime.slice(8, 10);
      return `${year}年${month}月${day}日`;
    };

    const isOwner = owner == this.props.loginUser.id;

    // ピックアップの表示分岐
    if (pickups.length !== 0) {
      pickupView = (
        <PickupULtag>
          {pickups.map((pickup) => {
            return <li>{pickup}</li>;
          })}
        </PickupULtag>
      );
    } else {
      pickupView = <UnregisteredPtag>未登録</UnregisteredPtag>;
    }

    // 取引完了かを基準に条件分岐
    if (this.state.giveItem.doneDeal) {
      // Owner以外なら交換完了の文章を表示
      if (this.props.loginUser == 'なし' || !isOwner) {
        requestButton = (
          <SubmitButton btn_type="button" btn_click={this.jumpToRequest} btn_disable="true">
            交換済み
          </SubmitButton>
        );

        alertMessage = <AlertPtag>この商品はすでに交換が完了しています</AlertPtag>;
      } // Ownerなら編集・削除不可の文章を表示
      else if (isOwner) {
        editButton = (
          <SubmitButton btn_type="button" btn_click={this.jumpToEdit} btn_disable="true">
            編集
          </SubmitButton>
        );

        deleteButton = (
          <BackButton btn_type="button" btn_click={this.handleDelete} btn_disable="true">
            削除
          </BackButton>
        );

        alertMessage = <AlertPtag>交換済みアイテムの編集・削除はできません</AlertPtag>;
      }
    }
    // 交換完了パターン終了
    else if (!this.state.giveItem.doneDeal) {
      // ゲストにはリクエスト送信を許可しない
      if (this.props.loginUser == 'なし') {
        requestButton = (
          <SubmitButton btn_type="button" btn_click={this.jumpToRequest} btn_disable="true">
            リクエストを送る
          </SubmitButton>
        );

        alertMessage = <AlertPtag>リクエストを送るにはユーザー登録が必要です</AlertPtag>;
      } //Owner は編集・削除ボタンの表示
      else if (isOwner) {
        editButton = (
          <SubmitButton btn_type="button" btn_click={this.jumpToEdit}>
            編集
          </SubmitButton>
        );
        deleteButton = (
          <BackButton btn_type="button" btn_click={this.handleDelete}>
            削除
          </BackButton>
        );
      } // 通常のユーザーはリクエスト送信済かで分岐
      else if (!isOwner) {
        if (sentRequest) {
          requestButton = (
            <SubmitButton btn_click={this.jumpToRequest} btn_disable={sentRequest}>
              リクエスト送信済
            </SubmitButton>
          );
        } else {
          requestButton = (
            <SubmitButton btn_click={this.jumpToRequest}>リクエストを送る</SubmitButton>
          );
        }
      }
    } // 交換未完了パターン終了

    if (loading === true) {
      return <CircularProgress />;
    }
    return (
      <div>
        <Carousel images={images} />
        <div>
          <h1>{parentItem.name}</h1>
          <DatePtag>{formatDataForDisplay(giveItem.createdAt)}に投稿</DatePtag>
          <InfoPtag>状態 : {giveItem.state}</InfoPtag>
          <InfoPtag>ブランド : {parentItem.bland}</InfoPtag>
          {giveItem.detail && <DetailPtag>{giveItem.detail}</DetailPtag>}
          <CategoryTag category_id={category_id} category_name={giveItem.category} />
          <PickupPtag>ピックアップ地点</PickupPtag>
          {pickupView}
          {alertMessage}
          <ButtonDiv>
            {editButton}
            {deleteButton}
            {requestButton}
          </ButtonDiv>
        </div>
      </div>
    );
  }
}

export default Give_Item_Description;

const DatePtag = styled.p`
  font-size: 0.8rem;
  margin: 0.3rem 0px 0.5rem 0px;
`;

const InfoPtag = styled.p`
  font-size: 1.11rem;
  margin-bottom: 0.67rem;
`;

const DetailPtag = styled(InfoPtag)`
  white-space: pre-wrap;
  width: 100%;
  border: 3.5px dashed ${Colors.accent1};
  border-radius: 1rem;
  padding: 0.7rem 1rem;
  font-size: 1rem;
`;

const UnregisteredPtag = styled.p`
  margin-left: 2.35rem;
`;

const PickupPtag = styled(InfoPtag)`
  margin-bottom: 0px;
  margin-top: 0.15rem;
`;

const PickupULtag = styled.ul`
  li {
    margin-left: 2.35rem;
    margin-bottom: 0.65rem;
  }
`;

const ButtonDiv = styled.div`
  display: flex;
  justify-content: space-around;
`;

const SubmitButton = styled(MiddleButton)`
  display: block;
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

const BackButton = styled(MiddleButton)`
  display: block;
  background: ${Colors.accent2};
  color: ${Colors.subcolor1};
  box-shadow: 4px 3px ${Colors.accent1};

  &:hover {
    background-color: #6792ab;
    transition: all 200ms linear;
  }

  &:active {
    box-shadow: 0px 0px 0px;
    transform: translate(4px, 3px);
  }

  &:disabled {
    background: #b6cbd7;
  }
`;

const AlertPtag = styled.p`
  margin: 1.5rem auto;
  width: 23em;
  font-size: 1.2rem;
  color: ${Colors.accent1};
  text-align:center;
`;
