import React, { Component } from 'react';
import styled from 'styled-components';

class Deal_Info_Table extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { item } = this.props;

    const formatDataForDisplay = (dataTime) => {
        const year = dataTime.slice(0, 4);
        const month = dataTime.slice(5, 7);
        const day = dataTime.slice(8, 10);
        const hour = dataTime.slice(11, 13);
        const min = dataTime.slice(14, 16);
        return `${year}年${month}月${day}日${hour}時${min}分`;
    };
    return (
      <TableSelf>
        <tr>
          <TableHead>ホスト</TableHead>
          <TableData>{item.hostUser}</TableData>
        </tr>

        <tr>
          <TableHead>ホストの出品</TableHead>
          <TableData>{item.hostItem}</TableData>
        </tr>

        <tr>
          <TableHead>あなたの引換え品</TableHead>
          <TableData>{item.joinItem}</TableData>
        </tr>
        <tr>
          <TableHead>受取場所</TableHead>
          <TableData>{item.pickups}</TableData>
        </tr>

        <tr>
          <TableHead>受取日時</TableHead>
          <TableData>{formatDataForDisplay(item.meetingTime)}</TableData>
        </tr>

      </TableSelf>
    );
  }
}

export default Deal_Info_Table;

const TableSelf = styled.table`
  width: 44%;
  border: solid 2px;
  border-collapse: collapse;
`;

const TableHead = styled.th`
  background: aliceblue;
  color: black;
  font-weight: bold;
  padding: 24px 21px;
  width: 30%;
  border: 2px solid;
`;

const TableData = styled.td`
  padding: 10px;
  padding: 24px 21px;
  width: 70%;
  border: solid 2px;
`;
