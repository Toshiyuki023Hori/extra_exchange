import React, { Component } from 'react';
import styled from 'styled-components';

export default function Item_Table(props) {
  const { item, parent_id } = props;
  return (
    <TableSelf className={props.className}>
      <tr>
        <TableHead>出品者</TableHead>
        <TableData>{item[parent_id].owner}</TableData>
      </tr>

      <tr>
        <TableHead>商品名</TableHead>
        <TableData>{item[parent_id].name}</TableData>
      </tr>

      <tr>
        <TableHead>状態</TableHead>
        <TableData>{item[parent_id].state}</TableData>
      </tr>
      <tr>
        <TableHead>カテゴリ</TableHead>
        <TableData>{item[parent_id].category}</TableData>
      </tr>

      <tr>
        <TableHead>ブランド</TableHead>
        <TableData>{item[parent_id].bland}</TableData>
      </tr>

      <tr>
        <TableHead>商品説明</TableHead>
        <TableData>{item[parent_id].detail}</TableData>
      </tr>
    </TableSelf>
  );
}

const TableSelf = styled.table`
  width: 60%;
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
  white-space: pre-wrap;
`;
