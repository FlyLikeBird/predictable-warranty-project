import React from 'react';
import MultiPieChart from './charts/MultiPieChart';
import MultiBarChart from '@/pages/alarm_manage/components/MultiBarChart';
import RankBarChart from '@/pages/alarm_manage/components/RankBarChart';
import style from '../AnalysisReport.css';
import IndexStyle from '@/pages/IndexPage.css';

function PageItem1({ alarm }) {
  const { alarmTrend, alarmRank } = alarm;
  return (
    <div className={style['page-container']}>
      <div className={style['page-title']}>
        <div className={style['text-container']}>平台告警趋势</div>
        <div className={style['symbol']}></div>
      </div>

      <div style={{ height: '300px', display: 'flex', paddingBottom: '1rem' }}>
        <div style={{ flex: '1', background: '#f7f8fa' }}>
          <MultiPieChart
            title="告警类型分布"
            hasLabel={true}
            data={{
              震动告警: 10,
              震动预警: 30,
              电流越限: 3,
              电压越限: 5,
              温度越限: 14,
            }}
            type="warningType"
          />
        </div>
        <div style={{ flex: '1', background: '#f7f8fa' }}>
          <MultiPieChart
            title="处理情况占比"
            data={{ 已处理: 10, 未处理: 30, 自动转工单: 25, 手动转工单: 40 }}
            type="warningStatus"
          />
        </div>
      </div>
      <div
        className={IndexStyle['card-container']}
        style={{
          backgroundColor: '#f7f8fa',
          height: '340px',
          marginBottom: '1rem',
          boxShadow: 'none',
        }}
      >
        <div className={IndexStyle['card-title']}>告警趋势</div>
        <div className={IndexStyle['card-content']}>
          <MultiBarChart title="告警趋势" data={alarmTrend} forReport={true} />
        </div>
      </div>
      <div
        className={IndexStyle['card-container']}
        style={{
          backgroundColor: '#f7f8fa',
          height: '340px',
          marginBottom: '1rem',
          boxShadow: 'none',
        }}
      >
        <div className={IndexStyle['card-title']}>设备异常排名</div>
        <div className={IndexStyle['card-content']}>
          <RankBarChart data={alarmRank} forReport={true} />
        </div>
      </div>
    </div>
  );
}

export default PageItem1;
