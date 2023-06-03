import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Button, Table, Modal } from 'antd';
import { PlusOutlined, DownloadOutlined } from '@ant-design/icons';
import OrderSelector from './components/OrderSelector';
import OrderForm from './components/OrderForm';
import style from '@/pages/IndexPage.css';
import MultiBarChart from './components/MultiBarChart';
import MultiPieChart from './components/MultiPieChart';
import OrderCheckBarChart from './components/OrderCheckBarChart';

function OrderManager({ dispatch, user, order }) {
  const { authorized } = user;
  const { chartInfo, checkInfo, statusInfo, orderTypeMaps, orderStatusMaps } =
    order;
  useEffect(() => {
    if (authorized) {
      dispatch({ type: 'user/toggleTimeType', payload: '2' });
      dispatch({ type: 'order/initTrend' });
    }
  }, [authorized]);

  return (
    <>
      <div style={{ height: '40%' }}>
        <div
          className={style['card-container-wrapper']}
          style={{ width: '50%' }}
        >
          <div
            className={style['card-container']}
            style={{ boxShadow: 'none' }}
          >
            <MultiPieChart
              data={statusInfo}
              orderTypeMaps={orderTypeMaps}
              orderStatusMaps={orderStatusMaps}
            />
          </div>
        </div>
        <div
          className={style['card-container-wrapper']}
          style={{ width: '50%', paddingRight: '0' }}
        >
          <div
            className={style['card-container']}
            style={{ boxShadow: 'none' }}
          >
            <OrderCheckBarChart data={checkInfo} />
          </div>
        </div>
      </div>
      <div
        className={style['card-container']}
        style={{ height: '60%', boxShadow: 'none' }}
      >
        <MultiBarChart orderTypeMaps={orderTypeMaps} data={chartInfo} />
      </div>
    </>
  );
}

export default connect(({ user, order }) => ({ user, order }))(OrderManager);
