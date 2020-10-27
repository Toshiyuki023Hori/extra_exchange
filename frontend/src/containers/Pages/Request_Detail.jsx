import React, { Component } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import history from '../../history';
import { Redirect } from 'react-router-dom';
import Header from '../Organisms/Header';
import Footer from '../Organisms/Footer';
import Request_Description from '../Organisms/Request_Description';
import MiddleButton from '../../presentational/shared/MiddleButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Colors, mixinHeaderSpace } from '../../presentational/shared/static/CSSvariables';

class Request_Detail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loginUser: '',
      requestDeal: '',
      hostItem: '',
      joinItem: '',
      itemImages: [],
      allMeeting: '',
      request: '',
    };
    this.deleteRequest = this.deleteRequest.bind(this);
  }

  async componentDidMount() {
    const localhostUrl = 'http://localhost:8000/api/';
    const requestDeal_id = this.props.match.params.requestDeal_id;
    let hostItem_id;
    let request_id;
    let itemsForState = {};

    const setItemsForState = (id, key, value) => {
      itemsForState = {
        [id]: { ...itemsForState[id], [key]: value },
      };
    };

    // hostItem, hostUser, joinItem取得のためにRequest_Deal取得
    await axios
      .all([
        axios.get(localhostUrl + 'user/' + localStorage.getItem('uid')),
        axios.get(localhostUrl + 'requestdeal/' + requestDeal_id),
      ])
      .then(
        axios.spread((resUser, resReqDeal) => {
          this.setState({ loginUser: resUser.data });
          this.setState({ requestDeal: resReqDeal.data });
          hostItem_id = resReqDeal.data.hostItem;
        })
      )
      .catch((err) => console.log(err)); // axios.all Closing

    // 閲覧者がjointUser以外ならリダイレクト
    if (this.state.requestDeal.joinUser != localStorage.getItem('uid')) {
      history.push('/top');
    } else {
      // Item_Tableに代入するためにhostItemを取得
      // joinItemは名前表示のために、ParentItemからnameだけ取得
      await axios
        .all([
          axios.get(localhostUrl + 'parent/' + hostItem_id),
          axios.get(localhostUrl + 'parent/' + this.state.requestDeal.joinItem),
          axios.get(localhostUrl + 'giveitem/?parent_item=' + hostItem_id),
        ])
        .then(
          axios.spread((resHost, resJoin, resGive) => {
            itemsForState = { [resHost.data.id]: resHost.data };
            setItemsForState(hostItem_id, 'give_id', resGive.data[0].id);
            setItemsForState(hostItem_id, 'state', resGive.data[0].state);
            setItemsForState(hostItem_id, 'category', resGive.data[0].category);
            setItemsForState(hostItem_id, 'detail', resGive.data[0].detail);
            this.setState({ joinItem: resJoin.data });
          })
        )
        .catch((err) => console.log(err)); // axios.all Closing

      console.log(itemsForState);

      // blandは任意fieldで対応が異なるため、別個でaxios使用。
      if (itemsForState[hostItem_id]['bland'] !== null) {
        await axios
          .get(localhostUrl + 'bland/' + itemsForState[hostItem_id].bland)
          .then((res) => setItemsForState(hostItem_id, 'bland', res.data.name))
          .catch((err) => console.log(err));
      } else {
        setItemsForState(hostItem_id, 'bland', 'なし');
      }
      // idから表示用にnameを取得、置換。
      await axios
        .all([
          axios.get(localhostUrl + 'category/' + itemsForState[hostItem_id].category),
          axios.get(localhostUrl + 'user/' + itemsForState[hostItem_id].owner),
        ])
        .then(
          axios.spread((resCategory, resUser) => {
            setItemsForState(hostItem_id, 'category', resCategory.data.name);
            console.log(itemsForState);
            setItemsForState(hostItem_id, 'owner', resUser.data.username);
          })
        )
        .catch((err) => console.log(err));
      // axios.all Closing

      // hostItemの持つ画像を全件取得. State => Item_Tableへ
      axios
        .get(localhostUrl + 'image/?item=' + itemsForState[hostItem_id]['give_id'])
        .then((res) => {
          res.data.map((imgObject) => {
            this.setState({ itemImages: [...this.state.itemImages, imgObject.image] });
          });
        });

      // Meeting取得のために、requestを取得、requestのidを代入
      await axios
        .get(localhostUrl + 'request/?request_deal=' + this.state.requestDeal.id)
        .then((res) => {
          if (res.data.length !== 0) {
            request_id = res.data[0].id;
            this.setState({ request: res.data[0] });
          }
        })
        .catch((err) => console.log(err));

      // request_idとリレーションを持つMeeting_Timeを取得
      axios.get(localhostUrl + 'meeting/?request=' + request_id).then((res) => {
        if (res.data.length !== 0) {
          console.log(res);
          this.setState({ allMeeting: res.data });
        }
      });

      await this.setState({ hostItem: itemsForState });
      this.setState({ loading: false });
    } // else closing
  }
  // componentDidMount Closing

  deleteRequest = () => {
    const token = localStorage.getItem('token');
    const authHeader = {
      headers: {
        Authorization: 'Token ' + token,
      },
    };
    const result = window.confirm('本当にこのリクエストを削除してもよろしいですか?');

    if (result) {
      axios
        .delete(
          'http://localhost:8000/api/requestdeal/' + this.props.match.params.requestDeal_id,
          authHeader
        )
        .then((res) => history.push('/request/waiting'))
        .catch((err) => window.alert(err.response.data.request_deal));
    }
  };

  render() {
    const { isAuthenticated } = this.props;
    const {
      loading,
      loginUser,
      hostItem,
      joinItem,
      requestDeal,
      itemImages,
      allMeeting,
      request,
    } = this.state;
    let meetingList;
    let requestStatusView;
    let deleteButton;

    const convertData = (dataTime) => {
      const year = dataTime.slice(0, 4);
      const month = dataTime.slice(5, 7);
      const day = dataTime.slice(8, 10);
      const hour = dataTime.slice(11, 13);
      const min = dataTime.slice(14, 16);
      return `${year}年${month}月${day}日${hour}時${min}分`;
    };

    if (request.denied === true) {
      requestStatusView = (
        <>
          <StatusPtag>拒否</StatusPtag>
          <ReasonPtag>{request.deniedReason}</ReasonPtag>
        </>
      );

      deleteButton = (
        <DeleteButton btn_type="submit" btn_click={this.deleteRequest}>
          リクエストを取り消す
        </DeleteButton>
      );
    } else if (request.accepted === true) {
      requestStatusView = <StatusPtag>承認</StatusPtag>;

      deleteButton = <AcceptedButton btn_disable="true">承認済のため削除不可</AcceptedButton>;
    } else if (request.accepted === false) {
      requestStatusView = <StatusPtag>未承認</StatusPtag>;

      deleteButton = (
        <DeleteButton btn_type="submit" btn_click={this.deleteRequest}>
          リクエストを取り消す
        </DeleteButton>
      );
    }

    if (allMeeting.length > 0) {
      console.log(allMeeting);
      meetingList = allMeeting.map((meetingObject) => {
        return <li key={meetingObject.id}>{convertData(meetingObject.whatTime)}</li>;
      });
    }

    if (!isAuthenticated) {
      return <Redirect to="/login" />;
    }
    if (loading === true) {
      return <CircularProgress />;
    } else {
      return (
        <div>
          <Header loginUser={loginUser} />
          <Body>
            <Styled_Request_Description
              h1Title="送信済リクエスト詳細"
              firstPartTitle="あなたの引き換え商品"
              firstPart={joinItem.name}
              secondPartTitle="リクエスト商品"
              tableItem={hostItem}
              tableKey={requestDeal.hostItem}
              swiperImages={itemImages}
              pickup={requestDeal.pickups}
            />
            <MeetingDiv>
              <h2>希望時間</h2>
              <ul>{meetingList}</ul>
            </MeetingDiv>
            {this.state.request.note && (
              <NoteDiv>
                <h2>補足</h2>
                <p>{this.state.request.note}</p>
              </NoteDiv>
            )}
            <RequestStatusDiv>
              <h2>リクエスト状況</h2>
              {requestStatusView}
            </RequestStatusDiv>
          </Body>
          {deleteButton}
          <Footer />
        </div>
      );
    }
  }
}

export default Request_Detail;

const Body = styled.div`
  ${mixinHeaderSpace};
  width: 77%;
  margin-left: auto;
  margin-right: auto;
`;

const Styled_Request_Description = styled(Request_Description)`
  padding-top: 1rem;
`;

const MeetingDiv = styled.div`
  margin-left: 1rem;
  margin-top: 0.65rem;

  h2 {
    display: inline-block;
    position: relative;

    &::before {
      content: '';
      height: 3px;
      width: 100%;
      position: absolute;
      top: 2rem;
      background: ${Colors.subcolor1};
    }
  }

  ul {
    margin-top: 0.4rem;
    margin-left: 2rem;
    font-size: 1.15rem;
    list-style: none;
  }
`;

const NoteDiv = styled.div`
  margin-left: 1rem;
  margin-top: 0.65rem;

  h2 {
    display: inline-block;
    position: relative;

    &::before {
      content: '';
      height: 3px;
      width: 100%;
      position: absolute;
      top: 2rem;
      background: ${Colors.subcolor1};
    }
  }

  p {
    margin-top: 0.4rem;
    margin-left: 2rem;
    font-size: 1.15rem;
    white-space: pre-wrap;
  }
`;

const RequestStatusDiv = styled.div`
  margin-left: 1rem;
  margin-top: 0.65rem;

  h2 {
    display: inline-block;
    position: relative;

    &::before {
      content: '';
      height: 3px;
      width: 100%;
      position: absolute;
      top: 2rem;
      background: ${Colors.subcolor1};
    }
  }

  p {
    margin-top: 0.4rem;
    margin-left: 2rem;
    font-size: 1.15rem;
    white-space: pre-wrap;
  }
`;

const DeleteButton = styled(MiddleButton)`
  display: block;
  margin: 1.5rem auto;
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
`;

const AcceptedButton = styled(MiddleButton)`
  display: block;
  margin: 1.5rem auto;
  background: #b6cbd7;
  color: ${Colors.subcolor1};
  box-shadow: 4px 3px ${Colors.accent1};
`;

const StatusPtag = styled.p`
  font-weight: bolder;
  font-size: 1.1rem;
`;

const ReasonPtag = styled.p`
  padding:1rem;
  border:3.5px dashed ${Colors.accent1};
  border-radius:1rem;
`;
