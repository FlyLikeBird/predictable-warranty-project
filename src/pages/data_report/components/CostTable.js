import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Table, Button } from 'antd';
import { FileExcelOutlined } from '@ant-design/icons';
import { downloadExcel } from '@/utils/array';
import XLSX from 'xlsx';
import TableSelector from './TableSelector';
import style from '@/pages/IndexPage.css';

const dotStyle = {
  width: '10px',
  height: '10px',
  display: 'inline-block',
  borderRadius: '50%',
};

function TableContainer({ list, category, dateColumn, currentPage, total }) {
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'equipmentName',
      width: 140,
      fixed: 'left',
      ellipsis: true,
    },
    { title: '单位', width: 60, render: () => <span>元</span> },
    { title: '合计', width: 120, dataIndex: 'sumCost' },
    ...dateColumn.map((time, index) => ({
      title: time,
      children: category.map((item) => ({
        title: `${item.title}`,
        dataIndex: 'costMonthList',
        width: item.multi ? '140px' : '90px',
        render: (arr) => {
          let obj = arr[index];
          return <span>{obj ? obj[item.dataIndex] : 0}</span>;
        },
      })),
    })),
  ];
  return (
    <div className={style['card-container']} style={{ boxShadow: 'none' }}>
      <div
        className={style['card-title']}
        style={{ height: '4rem', fontWeight: 'normal' }}
      >
        <div></div>
        <Button
          type="primary"
          size="small"
          ghost
          icon={<FileExcelOutlined />}
          onClick={() => {
            let fileTitle = '成本报表';
            var aoa = [],
              thead1 = [],
              thead2 = [];

            columns.forEach((col, index) => {
              if (col.children && col.children.length) {
                thead1.push(col.title);
                col.children.forEach((item, index) => {
                  thead2.push(item.title);
                  if (index === 0) return;
                  thead1.push(null);
                });
              } else {
                thead1.push(col.title);
                thead2.push(null);
              }
            });
            aoa.push(thead1);
            aoa.push(thead2);
            list.forEach((row) => {
              let temp = [];
              temp.push(row.equipmentCode);
              temp.push('元');
              temp.push(row.sumCost);
              row.costMonthList.forEach((obj) => {
                category.forEach((item) => {
                  let valueStr = '';

                  valueStr = obj[item.dataIndex];

                  temp.push(valueStr);
                });
              });
              aoa.push(temp);
            });

            var sheet = XLSX.utils.aoa_to_sheet(aoa);
            // 合并表格表头的格式
            let merges = [];
            merges.push({
              s: { r: 0, c: 0 },
              e: { r: 1, c: 0 },
            });
            thead1.forEach((item, index) => {
              if (item && item.includes(':')) {
                merges.push({
                  s: { r: 0, c: index },
                  e: { r: 0, c: index + category.length - 1 },
                });
              }
            });

            sheet['!cols'] = thead2.map((i) => ({ wch: 16 }));
            sheet['!merges'] = merges;
            downloadExcel(sheet, fileTitle + '.xlsx');
          }}
        >
          导出
        </Button>
      </div>
      <div
        className={style['card-content']}
        style={{ height: 'calc( 100% - 4rem)' }}
      >
        <Table
          columns={columns}
          style={{ padding: '0' }}
          rowKey="equipmentCode"
          className={style['self-table-container']}
          dataSource={list}
          scroll={{ x: '1000px' }}
          pagination={{
            current: currentPage,
            total,
            pageSize: 12,
            showSizeChanger: false,
          }}
          onChange={(pagination) => {
            dispatch({
              type: 'report/fetchCostReport',
              payload: { currentPage: pagination.current },
            });
          }}
        />
      </div>
    </div>
  );
}

export default TableContainer;
