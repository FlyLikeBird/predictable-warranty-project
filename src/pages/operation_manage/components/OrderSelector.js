import React, { useEffect, useState } from 'react';
import { Select, Button, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import style from '@/pages/IndexPage.css';
import CustomDatePicker from '@/components/CustomDatePicker';
import zhCN from 'antd/es/date-picker/locale/zh_CN';

function OrderSelector({ machList, orderTypeMaps, orderStatusMaps, onSearch }) {
  const [equipmentName, setEquipmentName] = useState('all');
  const [workTicketsType, setWorkTicketsType] = useState('all');
  const [workTicketsStatus, setWorkTicketsStatus] = useState('all');
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
            flex: '1',
            marginRight: '1rem',
          }}
        >
          <span>设备名称</span>
          <Select
            style={{ flex: '1', marginLeft: '0.5rem' }}
            value={equipmentName}
            onChange={(value) => setEquipmentName(value)}
          >
            <Option value="all">全部</Option>
            {machList.map((item) => (
              <Option value={item.equipmentName} key={item.equipmentName}>
                {item.equipmentName}
              </Option>
            ))}
          </Select>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flex: '1',
            marginRight: '1rem',
          }}
        >
          <span>工单类型</span>
          <Select
            style={{ flex: '1', marginLeft: '0.5rem' }}
            value={workTicketsType}
            onChange={(value) => setWorkTicketsType(value)}
          >
            <Option value="all">全部</Option>
            {Object.keys(orderTypeMaps).map((type) => (
              <Option key={type} value={type}>
                {orderTypeMaps[type].text}
              </Option>
            ))}
          </Select>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flex: '1',
            marginRight: '1rem',
          }}
        >
          <span>工单状态</span>
          <Select
            style={{ flex: '1', marginLeft: '0.5rem' }}
            value={workTicketsStatus}
            onChange={(value) => setWorkTicketsStatus(value)}
          >
            <Option value="all">全部</Option>
            {Object.keys(orderStatusMaps).map((type) => (
              <Option key={type} value={type}>
                {orderStatusMaps[type].text}
              </Option>
            ))}
          </Select>
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            flex: '2',
            marginRight: '1rem',
          }}
        >
          <span style={{ marginRight: '0.5rem' }}>创建时间</span>
          <CustomDatePicker noToggle={true} />
        </div>

        <div style={{ marginLeft: '1rem' }}>
          <Button
            type="primary"
            icon={<SearchOutlined />}
            style={{ marginRight: '0.5rem' }}
            onClick={() => {
              onSearch({ equipmentName, workTicketsType, workTicketsStatus });
            }}
          >
            查询
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              onSearch({});
              setEquipmentName('all');
              setWorkTicketsType('all');
              setWorkTicketsStatus('all');
            }}
          >
            重置
          </Button>
        </div>
      </div>
    </div>
  );
}

export default React.memo(OrderSelector);
