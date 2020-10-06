import React, { Component } from 'react';
import styled from 'styled-components';

class Request_Deal_Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { allRequests } = this.props;
    let tableDate;
    let status;
    
    const checkStatus = (id) => {
      if(allRequests[id]["denied"] === true){
        return "拒否"
      } else if(allRequests[id]["accepted"] === true){
        return "承認済"
      } else if(allRequests[id]["accepted"] === false){
        return "未承認"
      }
    };

    tableDate = Object.keys(allRequests).map((id, idx) => {
        return (
          <>
            <tr>
                <td>{idx+1}</td>
                <td>{allRequests[id]['hostItem']}</td>
                <td>{allRequests[id]['joinItem']}</td>
                <td>{allRequests[id]['hostUser']}</td>
                <td>{checkStatus(id)}</td>
            </tr>
          </>
        );
      });

      if(allRequests === "送信された取引リクエストはありません。"){
        return(
            <div>
                <h3>{allRequests}</h3>;
            </div>
        )
        } else {
            return (
                <div>
                <table>
                    <thead>
                        <tr>
                            <th>番号</th>
                            <th>商品(ホスト側)</th>
                            <th>商品(ジョイン側)</th>
                            <th>ホストユーザー</th>
                            <th>承認</th>
                        </tr>
                    </thead>

                    <tbody>
                        {tableDate}
                    </tbody>
                </table>
                </div>
            );
        }
  }
}

export default Request_Deal_Table;
