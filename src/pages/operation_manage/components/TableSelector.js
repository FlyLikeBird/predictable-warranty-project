import React, { useEffect, useState } from 'react';
import { Select, Input, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function TableSelector({ machList, userList, onSearch }) {
  const [equipmentCode, setEquipmentCode] = useState('all');
  const [upKeepStatus, setUpKeepStatus] = useState('all');
  const [equipmentHeadId, setEquipmentHeadId] = useState('all');

  return (
    <div className={style['card-container']} style={{ boxShadow: 'none' }}>
      <div className={style['card-title']}>
        <span>查询表格</span>
      </div>
      <div
        className={style['card-content']}
        style={{
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: '260px',
            marginRight: '1rem',
          }}
        >
          <span>设备名称</span>
          <Select
            style={{ flex: '1', marginLeft: '0.5rem' }}
            value={equipmentCode}
            onChange={(value) => setEquipmentCode(value)}
          >
            <Option value="all">全部</Option>
            {machList.map((item) => (
              <Option key={item.equipmentCode} value={item.equipmentCode}>
                {item.equipmentName}
              </Option>
            ))}
          </Select>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: '260px',
            marginRight: '1rem',
          }}
        >
          <span>保养状态</span>
          <Select
            style={{ flex: '1', marginLeft: '0.5rem' }}
            value={upKeepStatus}
            onChange={(value) => setUpKeepStatus(value)}
          >
            <Option value="all">全部</Option>
            <Option value="0">未保养</Option>
            <Option value="1">已保养</Option>
          </Select>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            width: '260px',
            marginRight: '1rem',
          }}
        >
          <span>负责人</span>
          <Select
            style={{ flex: '1', marginLeft: '0.5rem' }}
            value={equipmentHeadId}
            onChange={(value) => setEquipmentHeadId(value)}
          >
            <Option value="all">全部</Option>
            {userList.map((item) => (
              <Option key={item.userId} value={item.userId}>
                {item.userName}
              </Option>
            ))}
          </Select>
        </div>
        <div style={{ marginLeft: '1rem' }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ marginRight: '0.5rem' }}
            onClick={() => {
              onSearch({ equipmentCode, upKeepStatus, equipmentHeadId });
            }}
          >
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              onSearch({});
              setEquipmentCode('all');
              setUpKeepStatus('all');
              setEquipmentHeadId('all');
            }}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}

export default TableSelector;
