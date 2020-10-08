import React, { Component } from 'react';
import styled from 'styled-components';
import history from "../../history";

class Request_Deal_Table extends Component {
  constructor(props) {
    super(props);
    this.jumpToUniquePage = this.jumpToUniquePage.bind(this);
  }

  jumpToUniquePage = (requestDeal_id) => {
    history.push(this.props.jumpUrl + requestDeal_id)
  };

  render() {
    const { allRequests,parentType,requestOrDeal } = this.props;
    let tableHead;
    let tableData;
    let approveColumn;

    const checkStatus = (id) => {
      if(allRequests[id]["denied"] === true){
        return "拒否"
      } else if(allRequests[id]["accepted"] === true){
        return "承認"
      } else if(allRequests[id]["accepted"] === false){
        return "未承認"
      }
    };

    // hostUserとjoinUserでTableの並び順を変更
    if(parentType === "join") {
      tableHead = (
        <>
          <TableHead>番号</TableHead>
          <TableHead>商品(ホスト側)</TableHead>
          <TableHead>ホストユーザー</TableHead>
          <TableHead>商品(ジョイン側)</TableHead>
          <TableHead>承認</TableHead>
        </>
      )

      tableData = Object.keys(allRequests).map((id, idx) => {
        return (
          <>
            <tr onClick={() => this.jumpToUniquePage(id)}>
                <TableData>{idx+1}</TableData>
                <TableData>{allRequests[id]['hostItem']}</TableData>
                <TableData>{allRequests[id]['hostUser']}</TableData>
                <TableData>{allRequests[id]['joinItem']}</TableData>
                <TableData>{checkStatus(id)}</TableData>
            </tr>
          </>
        );
      });
    } else if(parentType === "host"){
      tableHead = (
        <>
          <TableHead>番号</TableHead>
          <TableHead>商品(ジョイン側)</TableHead>
          <TableHead>ジョインユーザー</TableHead>
          <TableHead>商品(ホスト側)</TableHead>
          <TableHead>承認</TableHead>
        </>
      )

      tableData = Object.keys(allRequests).map((id, idx) => {
        return (
          <>
            <tr onClick={() => this.jumpToUniquePage(id)}>
                <TableData>{idx+1}</TableData>
                <TableData>{allRequests[id]['joinItem']}</TableData>
                <TableData>{allRequests[id]['joinUser']}</TableData>
                <TableData>{allRequests[id]['hostItem']}</TableData>
                <TableData>{checkStatus(id)}</TableData>
            </tr>
          </>
        );
      });
    }

      if(allRequests === "送信された取引リクエストはありません。"){
        return(
            <div>
                <h3>{allRequests}</h3>;
            </div>
        )
        } else {
            return (
                <div>
                <TableSelf>
                    <thead>
                        <tr>
                            {tableHead}
                        </tr>
                    </thead>

                    <tbody>
                          {tableData}
                    </tbody>
                </TableSelf>
                </div>
            );
        }
  }
}

export default Request_Deal_Table;

const TableSelf = styled.table`
  width : 70%;
  border: solid 2px;
  border-collapse: collapse;
`;

const TableHead = styled.th`
  background: aliceblue;
  color: black;
  font-weight: bold;
  padding:24px 21px;
  border: 2px solid;
`;

const TableData = styled.td`
  padding: 10px;
  padding:24px 21px;
  border: solid 2px;
  text-align:center;
`;