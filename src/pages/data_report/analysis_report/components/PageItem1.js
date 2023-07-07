import React from 'react';
import PieChart from '@/pages/alarm_manage/components/PieChart';
import MultiBarChart from '@/pages/alarm_manage/components/MultiBarChart';
import RankBarChart from '@/pages/alarm_manage/components/RankBarChart';
import style from '../AnalysisReport.css';
import IndexStyle from '@/pages/IndexPage.css';

function PageItem1({ alarm }) {
  const { alarmTrend, alarmRank, statusMaps, alarmPercent } = alarm;
  return (
    <div className={style['page-container']}>
      <div className={style['page-title']}>
        <div className={style['text-container']}>平台告警趋势</div>
        <div className={style['symbol']}></div>
      </div>

      <div
        className={IndexStyle['card-container']}
        style={{
          height: '300px',
          background: '#f7f8fa',
          overflow: 'hidden',
          boxShadow: 'none',
          marginBottom: '1rem',
        }}
      >
        <PieChart
          title="告警类型和状态分布"
          data={alarmPercent}
          statusMaps={statusMaps}
        />
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
        <MultiBarChart title="告警趋势" data={alarmTrend} forReport={true} />
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
        <RankBarChart title="设备异常排名" data={alarmRank} forReport={true} />
      </div>
    </div>
  );
}

export default PageItem1;
