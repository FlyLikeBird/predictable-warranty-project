import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'dva';
import { Button, Table, Modal, Drawer } from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  createFromIconfontCN,
} from '@ant-design/icons';
import OrderSelector from './components/OrderSelector';
import OrderForm from './components/OrderForm';
import style from '@/pages/IndexPage.css';
import Icons from '../../../public/order-icons.png';
import OrderDetailInfo from './components/OrderDetailInfo';

const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_2314993_uvvxb10za8l.js',
});

const iconMaps = {
  0: 0,
  1: 2,
  2: 1,
  3: 6,
  4: 3,
  5: 5,
};
function OrderManager({ dispatch, user, order, mach, userList }) {
  const { authorized, userInfo } = user;
  const {
    orderList,
    statusInfo,
    orderTypeMaps,
    orderStatusMaps,
    orderSourceMaps,
    currentPage,
    total,
  } = order;
  const [visible, setVisible] = useState(false);
  const [currentOrder, setCurrentOrder] = useState({});
  useEffect(() => {
    if (authorized) {
      dispatch({ type: 'user/toggleTimeType', payload: '2' });
      dispatch({ type: 'order/initOrder' });
    }
  }, [authorized]);
  useEffect(() => {
    return () => {
      dispatch({ type: 'order/reset' });
    };
  }, []);
  const columns = [
    { title: '工单编号', dataIndex: 'workTicketsId' },
    {
      title: '工单类型',
      dataIndex: 'workTicketsType',
      render: (value) => (
        <span>
          <IconFont
            type={value === 1 ? 'iconfix' : 'iconmaintain'}
            style={{
              fontSize: '1.4rem',
              marginRight: '4px',
              color: orderTypeMaps[value].color,
            }}
          />
          {orderTypeMaps[value].text + '工单'}
        </span>
      ),
    },
    { title: '关联设备', dataIndex: 'equipmentName' },
    {
      title: '工单来源',
      dataIndex: 'workTicketsSource',
      render: (value) => <span>{orderSourceMaps[value]}</span>,
    },
    {
      title: '工单状态',
      dataIndex: 'workTicketsStatus',
      render: (value) => (
        <span style={{ color: orderStatusMaps[value].color }}>
          {orderStatusMaps[value] && orderStatusMaps[value].text}
        </span>
      ),
    },
    {
      title: '负责人',
      dataIndex: 'equipmentHeadName',
      render: (value) => <span>{value || '--'}</span>,
    },
    { title: '生成时间', dataIndex: 'createTime' },
    {
      title: '工单描述',
      dataIndex: 'workTicketsContent',
      render: (value) => <span>{value || '--'}</span>,
    },
    {
      title: '操作',
      render: (row) => (
        <>
          <a onClick={() => setCurrentOrder(row)}>
            {row.workTicketsStatus === 3 ? '查看' : '操作'}
          </a>
        </>
      ),
    },
  ];
  const handleSearch = useCallback((values) => {
    dispatch({ type: 'order/setOptional', payload: values });
    dispatch({ type: 'order/fetchOrderList' });
  }, []);
  return (
    <>
      <div
        style={{
          height: '120px',
          display: 'flex',
          justifyContent: 'space-between',
          paddingBottom: '1rem',
        }}
      >
        {statusInfo.infoList && statusInfo.infoList.length
          ? statusInfo.infoList.map((item, index) => (
              <div
                key={index}
                style={{
                  width: 'calc( (100% - 5rem)/6 )',
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: '#fff',
                  padding: '1rem',
                }}
              >
                <div
                  style={{
                    width: '54px',
                    height: '54px',
                    marginRight: '1rem',
                    backgroundImage: `url(${Icons})`,
                    backgroundPosition: `-${iconMaps[item.key] * 54}px 0px`,
                  }}
                ></div>
                <div>
                  <div style={{ fontSize: '0.8rem' }}>{item.title}</div>
                  <div>
                    <span style={{ fontSize: '1.6rem', marginRight: '4px' }}>
                      {item.value}
                    </span>
                    <span style={{ fontSize: '0.8rem' }}>件</span>
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
      <div style={{ height: '90px' }}>
        <OrderSelector
          machList={mach.list}
          orderTypeMaps={orderTypeMaps}
          orderStatusMaps={orderStatusMaps}
          onSearch={handleSearch}
        />
      </div>
      <div style={{ height: 'calc( 100% - 210px)', paddingTop: '1rem' }}>
        <div
          className={style['card-container']}
          style={{ boxShadow: 'none', paddingTop: '1rem' }}
        >
          <div className={style['card-title']}>
            <div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ marginRight: '0.5rem' }}
                onClick={() => setVisible(true)}
              >
                新建
              </Button>
              <Button>批量导入</Button>
            </div>
            <Button icon={<DownloadOutlined />}>下载</Button>
          </div>
          <div className={style['card-content']}>
            <Table
              columns={columns}
              style={{ padding: '0' }}
              className={style['self-table-container']}
              rowKey="workTicketsId"
              dataSource={orderList}
              pagination={{
                current: currentPage,
                total,
                pageSize: 10,
                showSizeChanger: false,
              }}
              locale={{
                emptyText: (
                  <div style={{ margin: '1rem 0' }}>还没有创建任何工单</div>
                ),
              }}
              onChange={(pagination) => {
                dispatch({
                  type: 'order/fetchOrderList',
                  payload: { currentPage: pagination.current },
                });
              }}
            />
          </div>
        </div>
        {/* 新建工单逻辑 */}
        <Modal
          title="新建工单"
          open={visible}
          onCancel={() => setVisible(false)}
          footer={null}
        >
          <OrderForm
            machList={mach.list}
            onDispatch={(action) => dispatch(action)}
            onClose={() => setVisible(false)}
          />
        </Modal>
        {/* 操作工单逻辑 */}
        <Drawer
          width="48%"
          open={currentOrder.workTicketsId ? true : false}
          onClose={() => setCurrentOrder({})}
          closable={false}
          headerStyle={{ display: 'none' }}
          bodyStyle={{ padding: '0' }}
        >
          <OrderDetailInfo
            onDispatch={(action) => dispatch(action)}
            currentOrder={currentOrder}
            orderTypeMaps={orderTypeMaps}
            orderStatusMaps={orderStatusMaps}
            orderSourceMaps={orderSourceMaps}
            userList={userList.list}
            userId={userInfo.userId}
            onClose={() => setCurrentOrder({})}
            onChange={(obj) => setCurrentOrder(obj)}
          />
        </Drawer>
      </div>
    </>
  );
}

export default connect(({ user, order, mach, userList }) => ({
  user,
  order,
  mach,
  userList,
}))(OrderManager);
