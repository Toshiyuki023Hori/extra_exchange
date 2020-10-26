import React, { Component } from 'react';
import styled from 'styled-components';
import history from '../../history';

class Request_Deal_Table extends Component {
  constructor(props) {
    super(props);
    this.jumpToUniquePage = this.jumpToUniquePage.bind(this);
  }

  jumpToUniquePage = (reqDealObj, requestDeal_id) => {
    // propsでloginUserを持つのはDeal_Proceedingのみ
    // join,hostそれぞれのページにジャンプさせる。
    if (
      reqDealObj[requestDeal_id]['joinUser'] === this.props.loginUser.username &&
      this.props.requestOrDeal === 'deal'
    ) {
      history.push(this.props.joinUserUrl + requestDeal_id);
    } else if (
      reqDealObj[requestDeal_id]['hostUser'] === this.props.loginUser.username &&
      this.props.requestOrDeal === 'deal'
    ) {
      history.push(this.props.hostUserUrl + requestDeal_id);
    } else {
      history.push(this.props.jumpUrl + requestDeal_id);
    }
  };

  render() {
    const { requestDeal, parentType, requestOrDeal } = this.props;
    let tableHead;
    let tableData;
    let approveColumn;

    const checkStatus = (id) => {
      if (requestDeal[id]['denied'] === true) {
        return '拒否';
      } else if (requestDeal[id]['accepted'] === true) {
        return '承認';
      } else if (requestDeal[id]['accepted'] === false) {
        return '未承認';
      } else if (requestDeal[id]['joinUserAccept'] === true) {
        return '済';
      } else if (requestDeal[id]['joinUserAccept'] === false) {
        return '未';
      }
    };

    // hostUserとjoinUserでTableの並び順を変更
    if (parentType === 'join') {
      tableHead = (
        <>
          <TableHead>番号</TableHead>
          <TableHead>商品(ホスト側)</TableHead>
          <TableHead>ホストユーザー</TableHead>
          <TableHead>商品(ジョイン側)</TableHead>
          <TableHead>承認</TableHead>
        </>
      );

      tableData = Object.keys(requestDeal).map((id, idx) => {
        return (
          <>
            <tr onClick={() => this.jumpToUniquePage(requestDeal, id)}>
              <TableData>{idx + 1}</TableData>
              <TableData>{requestDeal[id]['hostItem']}</TableData>
              <TableData>{requestDeal[id]['hostUser']}</TableData>
              <TableData>{requestDeal[id]['joinItem']}</TableData>
              <TableData>{checkStatus(id)}</TableData>
            </tr>
          </>
        );
      });
    } else if (parentType === 'host') {
      tableHead = (
        <>
          <TableHead>番号</TableHead>
          <TableHead>商品(ジョイン側)</TableHead>
          <TableHead>ジョインユーザー</TableHead>
          <TableHead>商品(ホスト側)</TableHead>
          <TableHead>承認</TableHead>
        </>
      );

      tableData = Object.keys(requestDeal).map((id, idx) => {
        return (
          <>
            <tr onClick={() => this.jumpToUniquePage(requestDeal, id)}>
              <TableData>{idx + 1}</TableData>
              <TableData>{requestDeal[id]['joinItem']}</TableData>
              <TableData>{requestDeal[id]['joinUser']}</TableData>
              <TableData>{requestDeal[id]['hostItem']}</TableData>
              <TableData>{checkStatus(id)}</TableData>
            </tr>
          </>
        );
      });
    } else if (requestOrDeal === 'deal') {
      tableHead = (
        <>
          <TableHead>番号</TableHead>
          <TableHead>商品(ホスト側)</TableHead>
          <TableHead>ホストユーザー</TableHead>
          <TableHead>商品(ジョイン側)</TableHead>
          <TableHead>ジョインユーザー</TableHead>
          <TableHead>受取確認(ジョイン)</TableHead>
        </>
      );

      tableData = Object.keys(requestDeal).map((id, idx) => {
        return (
          <>
            <tr onClick={() => this.jumpToUniquePage(requestDeal, id)}>
              <TableData>{idx + 1}</TableData>
              <TableData>{requestDeal[id]['hostItem']}</TableData>
              <TableData>{requestDeal[id]['hostUser']}</TableData>
              <TableData>{requestDeal[id]['joinItem']}</TableData>
              <TableData>{requestDeal[id]['joinUser']}</TableData>
              <TableData>{checkStatus(id)}</TableData>
            </tr>
          </>
        );
      });
    }

    if (
      requestDeal === '送信された取引リクエストはありません。' ||
      requestDeal === '申請されているリクエストはありません。' ||
      requestDeal === '進行中の取引はありません。'
    ) {
      return (
        <div>
          <h3>{requestDeal}</h3>
        </div>
      );
    } else {
      return (
        <div className={this.props.className}>
          <TableSelf>
            <thead>
              <tr>{tableHead}</tr>
            </thead>

            <tbody>{tableData}</tbody>
          </TableSelf>
        </div>
      );
    }
  }
}

export default Request_Deal_Table;

const TableSelf = styled.table`
  width: 70%;
  border: solid 2px;
  border-collapse: collapse;
  margin:0 auto;
`;

const TableHead = styled.th`
  background: aliceblue;
  color: black;
  font-weight: bold;
  padding: 24px 21px;
  border: 2px solid;
`;

const TableData = styled.td`
  padding: 10px;
  padding: 24px 21px;
  border: solid 2px;
  text-align: center;
`;
