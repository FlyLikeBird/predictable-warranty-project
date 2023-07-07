import React, { useState, useEffect, useCallback } from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import TableSelector from './components/TableSelector';
import PieChart from './components/PieChart';
import RankBarChart from './components/RankBarChart';
import MultiBarChart from './components/MultiBarChart';
import style from '@/pages/IndexPage.css';

function AlarmAnalysis({ dispatch, user, mach, alarm }) {
  const { authorized } = user;
  const { alarmPercent, alarmTrend, statusMaps, alarmRank } = alarm;
  useEffect(() => {
    if (authorized) {
      dispatch({ type: 'user/toggleTimeType', payload: '2' });
      dispatch({ type: 'mach/fetchMachList' });
      dispatch({ type: 'alarm/initAnalysis' });
    }
  }, [authorized]);
  useEffect(() => {
    return () => {
      dispatch({ type: 'alarm/reset' });
    };
  }, []);
  const handleSearch = useCallback((obj) => {
    dispatch({ type: 'alarm/setOptional', payload: obj });
    dispatch({ type: 'alarm/initAnalysis' });
  }, []);
  return (
    <>
      <div style={{ height: '90px' }}>
        <TableSelector machList={mach.list} onSearch={handleSearch} />
      </div>
      <div style={{ height: 'calc( 100% - 90px)', paddingTop: '1rem' }}>
        <div style={{ height: '50%' }}>
          <div
            className={style['card-container-wrapper']}
            style={{ width: '50%' }}
          >
            <div
              className={style['card-container']}
              style={{ boxShadow: 'none' }}
            >
              <PieChart
                title="总告警占比"
                data={alarmPercent}
                statusMaps={statusMaps}
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
              <RankBarChart title="设备异常排名" data={alarmRank} />
            </div>
          </div>
        </div>
        <div style={{ height: '50%' }}>
          <div
            className={style['card-container']}
            style={{ boxShadow: 'none' }}
          >
            {Object.keys(alarmTrend).length ? (
              <MultiBarChart title="总告警趋势" data={alarmTrend} />
            ) : (
              <Spin className={style['spin']} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default connect(({ user, alarm, mach }) => ({ user, alarm, mach }))(
  AlarmAnalysis,
);
